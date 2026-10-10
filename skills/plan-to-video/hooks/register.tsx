// reelplanner in Claude Code: a pane that plays a plan's video, stops at each open choice, takes the answer,
// plays the branch it picked and goes on, then files the answers the way the review player does.
//
// The picture is the video's own render (scripts/reel-frames.mjs makes it once, renders/terminal.mp4, and
// streams its frames): a sharp Image in a terminal that draws kitty graphics (kitty, Ghostty), and a few frames
// a second as an Svg in the desktop and mobile apps. Any other terminal could only draw it in coarse blocks,
// unreadable, so there the browser player opens and the pane keeps the choices, the comments and Send. The
// sound plays on the machine the session runs on.
//
// /reel lists the plans with a video; /reel <plan> (or a video's folder) opens one. When the agent opens a
// video for review (`reelplanner review …`), a band above the prompt offers it here too. Send writes the
// review row into .reelplanner/inbox/, where a waiting `review --wait` claims it; with nobody waiting, it asks
// this session to file it (reel-intake). The full player is a key away: the local page from a terminal, or,
// in a cloud session where localhost is out of reach, the player published as an Artifact.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement, RenderSurface } from 'claude-code'

import type {
  ReelplannerAnswer,
  ReelplannerComment,
  ReelplannerOpen,
  ReelplannerPlan,
  ReelplannerPlayback,
  ReelplannerSent,
  ReelplannerVerdict,
  ReelplannerWhich,
} from '../types'

const PANE = 'reelplanner'

const open = atom({ plugin: 'reelplanner', key: 'open' } as const, null as ReelplannerOpen)
const library = atom({ plugin: 'reelplanner', key: 'library' } as const, [] as ReelplannerPlan[])
const answers = atom({ plugin: 'reelplanner', key: 'answers' } as const, {} as Record<string, ReelplannerAnswer>)
const verdicts = atom({ plugin: 'reelplanner', key: 'verdicts' } as const, {} as Record<string, ReelplannerVerdict>)
const notes = atom({ plugin: 'reelplanner', key: 'notes' } as const, {} as Record<string, string>)
const links = atom({ plugin: 'reelplanner', key: 'links' } as const, {} as Record<string, string>)
const sent = atom({ plugin: 'reelplanner', key: 'sent' } as const, {} as Record<string, ReelplannerSent>)
const ready = atom({ plugin: 'reelplanner', key: 'ready' } as const, null as { slug: string; which: ReelplannerWhich } | null)
const publishing = atom({ plugin: 'reelplanner', key: 'publishing' } as const, null as string | null)
const busy = atom({ plugin: 'reelplanner', key: 'busy' } as const, null as string | null)
const playback = atom({ plugin: 'reelplanner', key: 'playback' } as const, null as ReelplannerPlayback | null)
const flip = atom({ plugin: 'reelplanner', key: 'flip' } as const, null as string | null)
const theater = atom({ plugin: 'reelplanner', key: 'theater' } as const, false as boolean)
const onlyChanges = atom({ plugin: 'reelplanner', key: 'onlyChanges' } as const, {} as Record<string, boolean>)
const composing = atom({ plugin: 'reelplanner', key: 'composing' } as const, null as string | null)
const comments = atom({ plugin: 'reelplanner', key: 'comments' } as const, {} as Record<string, ReelplannerComment[]>)

// --- plan-map.json, the file the player reads (scripts/plan-map.mjs) -------------------------------

type Branch = { start: number; end: number }
type Option = { id: string; label: string; why?: string; recommended?: boolean; more?: string; branch?: Branch }
type Decision = {
  id: string
  kind?: 'one' | 'multi'
  frameIndex?: number
  planStep?: number | null
  question: string
  questionMore?: string
  at?: number
  resumeAt?: number
  options: Option[]
}
type Call = {
  id: string
  frameIndex?: number
  planStep?: number | null
  chose: string
  insteadOf?: string
  why?: string
  check?: string
  at?: number
}
type Frame = {
  index: number
  title?: string
  compositionId?: string
  narration?: string
  decision?: string | null
  start?: number
  durationSeconds?: number
  planStep?: number | null
}
type PlanMap = {
  project?: string
  title?: string
  planDir?: string
  totalSeconds?: number
  decisions?: Decision[]
  autonomy?: Call[]
  frames?: Frame[]
  /** What plan-diff found against the last build (scripts/plan-map.mjs): the frames whose scenes changed. */
  changes?: { changedFrames?: number[]; changedSeconds?: number; totalSeconds?: number }
}
type Caption = { start: number; end: number; text: string }

/** One video the pane can show: a plan's (under .reelplanner/plans/) or any built video's folder. */
type Video = { slug: string; which: ReelplannerWhich; dir: string; key: string; inPlans: boolean }

const maps = new Map<string, { mtimeMs: number; map: PlanMap }>()
const captionsOf = new Map<string, Caption[]>()

const plansDir = (root: string) => `${root}/.reelplanner/plans`
const videoDir = (root: string, slug: string, which: ReelplannerWhich) => `${plansDir(root)}/${slug}/${which}`
const isPlanVideo = (which: ReelplannerWhich) => which === 'video'
const videoOf = (root: string, o: { slug: string; which: ReelplannerWhich; dir?: string }): Video =>
  o.dir
    ? { slug: o.slug, which: o.which, dir: o.dir, key: o.dir, inPlans: false }
    : { slug: o.slug, which: o.which, dir: videoDir(root, o.slug, o.which), key: `${o.slug}:${o.which}`, inPlans: true }

async function loadMap($: EngineInterface, dir: string) {
  const path = `${dir}/plan-map.json`
  try {
    const { mtimeMs } = await $.fs.stat(path)
    const cached = maps.get(path)
    if (cached && cached.mtimeMs === mtimeMs) return cached.map
    const map = JSON.parse(await $.fs.read(path)) as PlanMap
    maps.set(path, { mtimeMs, map })
    return map
  } catch {
    return null
  }
}

/** When the video's plan map was last written: a rebuild writes it anew. */
const builtAt = (dir: string) => maps.get(`${dir}/plan-map.json`)?.mtimeMs ?? 0

/** A revision (some scenes changed since the last build, not all): it can play just what changed. */
const isRevision = (map: PlanMap) => {
  const n = map.changes?.changedFrames?.length ?? 0
  return n > 0 && n < (map.frames ?? []).length
}

/**
 * Just the changes, as the browser player plays them: the changed scenes, and any scene still holding a
 * question not answered here (an open question is never skipped because its scene did not change).
 */
function changedOnly(map: PlanMap, stretches: { from: number; to: number }[], answered: (id: string) => boolean) {
  const changed = new Set(map.changes?.changedFrames ?? [])
  const keep = (map.frames ?? [])
    .filter(f => changed.has(f.index) || (map.decisions ?? []).some(d => d.frameIndex === f.index && !answered(d.id)))
    .map(f => ({ from: f.start ?? 0, to: (f.start ?? 0) + (f.durationSeconds ?? 0) }))
    .sort((x, y) => x.from - y.from)
  const out: { from: number; to: number }[] = []
  for (const s of stretches)
    for (const k of keep) {
      const from = Math.max(s.from, k.from), to = Math.min(s.to, k.to)
      if (to - from < 0.05) continue
      const last = out[out.length - 1]
      if (last && from - last.to < 0.05) last.to = to
      else out.push({ from, to })
    }
  // nothing changed before the next stop: a moment of it, so the video still lands on the stop
  const end = stretches[stretches.length - 1]
  return out.length ? out : end ? [{ from: Math.max(end.from, end.to - 0.5), to: end.to }] : []
}

async function loadCaptions($: EngineInterface, dir: string) {
  const cached = captionsOf.get(dir)
  if (cached) return cached
  let list: Caption[] = []
  try {
    list = (JSON.parse(await $.fs.read(`${dir}/caption_groups.json`)) as Caption[]).map(c => ({
      start: c.start,
      end: c.end,
      text: c.text,
    }))
  } catch {}
  captionsOf.set(dir, list)
  return list
}

const stopsOf = (map: PlanMap, which: ReelplannerWhich): (Decision | Call)[] =>
  isPlanVideo(which) ? (map.decisions ?? []) : (map.autonomy ?? [])

/** The stretch of video before stop `i` (the summary is stop `stops.length`): from where the last stop resumes to this one. */
function stretch(map: PlanMap, which: ReelplannerWhich, i: number) {
  const stops = stopsOf(map, which)
  const prev = stops[i - 1]
  const from = prev ? ((prev as Decision).resumeAt ?? prev.at ?? 0) : 0
  const to = stops[i]?.at ?? map.totalSeconds ?? from
  return { from, to: Math.max(from, to) }
}

const count = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

const clock = (s?: number) =>
  s === undefined ? '' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

async function scanLibrary($: EngineInterface): Promise<ReelplannerPlan[]> {
  const root = await $.session.root()
  let entries: { name: string; kind: string }[] = []
  try {
    entries = await $.fs.list(plansDir(root))
  } catch {
    return []
  }
  const plans: ReelplannerPlan[] = []
  for (const entry of entries.filter(x => x.kind === 'dir').sort((a, b) => b.name.localeCompare(a.name))) {
    const slug = entry.name
    const plan = await loadMap($, videoDir(root, slug, 'video'))
    const walk = await loadMap($, videoDir(root, slug, 'walkthrough-video'))
    if (!plan && !walk) continue
    let reviews: string[] = []
    try {
      reviews = (await $.fs.list(`${plansDir(root)}/${slug}/reviews`)).map(x => x.name)
    } catch {}
    plans.push({
      slug,
      title: plan?.title ?? walk?.title ?? slug,
      choices: plan ? (plan.decisions ?? []).length : null,
      calls: walk ? (walk.autonomy ?? []).length : null,
      planReviewed: reviews.some(n => n.startsWith('plan-') && n.endsWith('.json')),
      walkthroughReviewed: reviews.some(n => n.startsWith('walkthrough-') && n.endsWith('.json')),
    })
  }
  return plans
}

/** The video a plan opens on: its walkthrough while that waits on a review, else its plan video. */
function defaultWhich(plan: ReelplannerPlan): ReelplannerWhich {
  if (plan.calls !== null && !plan.walkthroughReviewed) return 'walkthrough-video'
  return plan.choices !== null ? 'video' : 'walkthrough-video'
}

/** This checkout's own tooling when the repo is reelplanner itself (AGENTS.md), else the installed CLI. */
async function cli($: EngineInterface, root: string) {
  try {
    const pkg = JSON.parse(await $.fs.read(`${root}/package.json`)) as { name?: string }
    if (pkg.name === 'reelplanner' && (await $.fs.exists(`${root}/bin/reelplanner.mjs`))) {
      return { argv: ['node', `${root}/bin/reelplanner.mjs`], said: 'node bin/reelplanner.mjs' }
    }
  } catch {}
  return { argv: ['reelplanner'], said: 'reelplanner' }
}

const isCloud = async ($: EngineInterface) => (await $.env.get('CLAUDE_CODE_REMOTE')) === 'true'

// --- the picture --------------------------------------------------------------------------------------

/** The screen's size in cells: as wide as the pane lets it, 16:9 (a cell is half as wide as it is tall). */
/** The picture's box in cells: as wide as the pane, a 16:9 frame (a cell is twice as tall as wide), and no taller
 * than `room` rows, narrowing to keep the frame when the pane is short (inline above the prompt). */
const screenSize = (bodyColumns: number, room = Infinity) => {
  let cols = Math.max(24, Math.min(240, bodyColumns - 1))
  let rows = Math.max(6, Math.round((cols * 9) / 32))
  if (rows > room) {
    rows = Math.max(6, Math.floor(room))
    cols = Math.max(24, Math.round((rows * 32) / 9))
  }
  return { cols, rows }
}

const toBase64 = (bytes: Uint8Array) => (bytes as unknown as { toBase64(): string }).toBase64()

const jpegSvg = (base64: string, width: number, height: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">` +
  `<image href="data:image/jpeg;base64,${base64}" width="${width}" height="${height}"/></svg>`

/** How this surface shows the picture: kitty graphics, frames as an Svg, or (a terminal without kitty graphics) not in the pane at all. */
async function modeFor($: EngineInterface, surface: RenderSurface | null): Promise<ReelplannerPlayback['mode'] | 'browser'> {
  if (surface !== 'terminal') return 'jpeg'
  if (imageRefused) return 'browser'
  const program = (await $.env.get('TERM_PROGRAM')) ?? ''
  const term = (await $.env.get('TERM')) ?? ''
  const kitty = (await $.env.get('KITTY_WINDOW_ID')) !== undefined
  return kitty || term === 'xterm-kitty' || /ghostty/i.test(program) ? 'image' : 'browser'
}

// The playback in flight: one at a time. Each play takes a new id; a loop whose id is no longer current stops.
let current = 0
let stream: AsyncGenerator<unknown, unknown> | null = null
let imageRefused = false
const pictures = new Map<string, { file: string; format: 'rgb'; width: number; height: number; generation: number }>() // the same for an Image
let imageSize = { width: 0, height: 0 }
let paneColumns = 0 // the pane's width as last drawn
let paneRows = 0 // and its rows: a docked pane is floor to ceiling, an inline one what it asked for
let termRows = 0 // the terminal's rows, as a drawing last saw them
let inlinePane = false // the pane as last drawn sat inline above the prompt (the main-screen layout), not docked

/** The rows the picture may take: bigger (z), all but the header and the keys; else room left for the card under it. */
const pictureRoom = (big: boolean) => (paneRows ? Math.max(6, paneRows - (big ? 4 : 14)) : Infinity)

/** How the pane opens. Docked beside the transcript, `columns` widens it (z), as far as the dock goes; inline above
 * the prompt (the main-screen layout), it spans the terminal and `rows` makes it tall: most of the screen, all of it
 * but the prompt with z. The dock ignores `rows`, the inline block `columns`. */
const paneArgs = (big: boolean, focus: boolean, termCols = 0) => ({
  id: PANE,
  title: 'reelplanner',
  ...(focus ? { focus: true as const } : {}),
  ...(big && termCols ? { columns: Math.max(100, termCols - 24) } : {}),
  ...(termRows ? { rows: Math.max(12, big ? termRows - 5 : Math.round(termRows * 0.7)) } : {}),
})
// where a comment being written was begun, and what plays when it is saved (null: the video was still)
let commentAt: { key: string; t: number; resume: { from: number; to: number }[] | null } | null = null
// the branch clip an answer started: a pause inside it resumes the clip, then the video from where the question resumes
// (not on through the next option's clip, which lies right after it)
let branchOf: { key: string; stop: number; end: number } | null = null

async function stopPlayback($: EngineInterface, status: ReelplannerPlayback['status'] = 'paused') {
  current++
  const s = stream
  stream = null
  if (s) await s.return(undefined).catch(() => undefined)
  await update($, playback, p => (p && (p.status === 'playing' || p.status === 'rendering') ? { ...p, status } : p))
}

/**
 * Plays the stretches one after another, rendering the video first when it has no render yet. Each frame goes
 * straight to the screen (blit, no redraw); the time is written a few times a second, for the clock and the
 * captions.
 */
async function play(
  $: EngineInterface,
  v: Video,
  stretches: { from: number; to: number }[],
  size: { cols: number; rows: number },
  opts: { still?: boolean } = {},
): Promise<void> {
  try {
    await playing($, v, stretches, size, opts)
  } catch (err) {
    // reel-frames could not start (an installed reelplanner from before it), or the stream broke
    await update($, playback, p =>
      p ? { ...p, status: 'failed' as const, message: `${String(err).slice(0, 200)} (is reelplanner up to date? it needs reel-frames)` } : p,
    )
  }
}

async function playing(
  $: EngineInterface,
  v: Video,
  stretches: { from: number; to: number }[],
  size: { cols: number; rows: number },
  opts: { still?: boolean },
) {
  await stopPlayback($)
  const id = ++current
  const root = await $.session.root()
  const { argv } = await cli($, root)
  const mode = await modeFor($, await $.session.surface())
  if (mode === 'browser') return openPlayer($, v)
  const until = stretches[stretches.length - 1]?.to ?? 0
  const base: ReelplannerPlayback = { key: v.key, status: 'rendering', t: stretches[0]?.from ?? 0, until, mode, ...size }
  await update($, playback, () => base)

  const lines = async function* (args: string[]) {
    const s = $.process.spawn({ argv: [...argv, 'reel-frames', v.dir, ...args], cwd: root })
    stream = s
    let buf = ''
    for await (const chunk of s) {
      if (id !== current) return
      if (chunk.stream !== 'stdout') continue
      buf += chunk.text
      let nl
      while ((nl = buf.indexOf('\n')) >= 0) {
        yield buf.slice(0, nl)
        buf = buf.slice(nl + 1)
      }
    }
  }
  const failed = (message: string) => update($, playback, p => (p ? { ...p, status: 'failed' as const, message } : p))

  // the render, once: its progress on the screen
  let rendered = false
  for await (const line of lines(['--render'])) {
    if (line.startsWith('P ')) await update($, playback, p => (p ? { ...p, progress: Number(line.slice(2)) } : p))
    else if (line.startsWith('R ')) rendered = true
    else if (line.startsWith('X ')) return failed(line.slice(2))
  }
  if (id !== current) return
  if (!rendered) return failed('the render did not finish')

  let wrote = 0
  for (const { from, to } of stretches) {
    const args = ['--from', String(from), '--to', String(to), '--as', mode]
    // the frames in a folder of the video's own (renders/ is left out of git), kept after the stretch: a redraw shows the last
    if (mode === 'image') args.push('--width', String(Math.min(1280, size.cols * 10)), '--dir', `${v.dir}/renders/frames`)
    if (mode === 'jpeg') args.push('--width', '384', '--fps', '3', '--no-audio')
    else if (opts.still) args.push('--no-audio')
    await update($, playback, p => (p ? { ...p, status: 'playing' as const, t: from, progress: undefined } : p))
    for await (const line of lines(args)) {
      const [kind, t, rest, gen] = line.split(' ')
      if (kind === 'V') imageSize = { width: Number(rest), height: Number(gen) }
      else if (kind === 'A') await update($, playback, p => (p ? { ...p, audio: line.slice(2) } : p))
      else if (kind === 'X') return failed(line.slice(2))
      else if (kind === 'F' || kind === 'I') {
        if (kind === 'F' && mode === 'jpeg' && rest) {
          await update($, flip, () => jpegSvg(rest, 384, 216))
        } else if (kind === 'I' && rest) {
          const source = { file: rest, format: 'rgb' as const, width: imageSize.width, height: imageSize.height, generation: Number(gen) }
          pictures.set(v.key, source)
          const res = await $.ui.blit({ requestId: PANE, key: 'screen', source })
          if (res.deny && /alt/.test(res.deny)) {
            // this terminal draws the Image's words, not its picture: the browser player instead
            imageRefused = true
            await stopPlayback($)
            await update($, playback, () => null)
            return openPlayer($, v)
          }
        }
        const now = Number(t)
        if (now - wrote >= 0.25) {
          wrote = now
          await update($, playback, p => (p ? { ...p, t: now } : p))
        }
      }
    }
    if (id !== current) return
    await update($, playback, p => (p ? { ...p, t: to } : p))
  }
  stream = null
  // a still frame (a seek while paused) stays paused where it was put, not at the end of its moment
  const at = opts.still ? (stretches[0]?.from ?? until) : until
  await update($, playback, p => (p ? { ...p, status: opts.still ? ('paused' as const) : ('ended' as const), t: at } : p))
}

/** Play up to stop `i` of the video open in the pane (the summary: to the end). */
async function playTo($: EngineInterface, v: Video, i: number, size: { cols: number; rows: number }, from?: number) {
  const map = await loadMap($, v.dir)
  if (!map) return
  const s = stretch(map, v.which, i)
  const list = [{ from: from ?? s.from, to: s.to }]
  // a revision plays just what changed, unless asked for the whole video
  if (isRevision(map) && (await read($, onlyChanges))[v.key] !== false) {
    const given = await read($, answers)
    return play($, v, changedOnly(map, list, id => Boolean(given[`${v.key}:${id}`])), size)
  }
  return play($, v, list, size)
}

// --- the review row, as the player's Finish → Send builds it (packages/player, reviewRow) ------------

const randomId = () => Math.random().toString(36).slice(2, 15)

async function buildRow($: EngineInterface, v: Video, verdict: 'approve' | 'changes') {
  const map = await loadMap($, v.dir)
  if (!map) throw new Error(`no plan-map.json in ${v.dir}`)
  const now = new Date(await $.clock.now()).toISOString()
  const allAnswers = await read($, answers)
  const allVerdicts = await read($, verdicts)
  const note = (await read($, notes))[v.key] ?? ''
  const all = map.frames ?? []
  const frameRef = (f: Frame | null | undefined) =>
    f ? { compositionId: f.compositionId ?? '', index: f.index, title: f.title ?? '' } : null
  const frameOf = (stop: Decision | Call) =>
    all.find(f => f.decision === stop.id) ?? all.find(f => f.index === stop.frameIndex) ?? null
  const annotations: unknown[] = []

  const decisions = isPlanVideo(v.which)
    ? (map.decisions ?? []).flatMap(q => {
        const a = allAnswers[`${v.key}:${q.id}`]
        if (!a) return []
        const picked = q.options.find(o => o.id === a.option)
        if (a.option === 'own') {
          annotations.push({
            id: randomId(),
            kind: 'note',
            about: `Answered in their own words: ${q.question}`,
            comment: a.label,
            t: q.at ?? 0,
            frame: frameRef(frameOf(q)),
            plan: { component: null, questions: [], step: q.planStep ?? null },
          })
        }
        return [
          {
            id: q.id,
            option: a.option,
            label: a.label,
            ...(a.option === 'own' ? { own: true } : {}),
            ...(a.options ? { options: a.options, labels: a.labels } : {}),
            ...(a.note ? { note: a.note } : {}),
            recommended: picked?.recommended ?? false,
            planStep: q.planStep ?? null,
            question: q.question,
            t: q.at ?? 0,
            decidedAt: a.at,
          },
        ]
      })
    : []

  const autonomy = isPlanVideo(v.which)
    ? []
    : (map.autonomy ?? []).flatMap(c => {
        const j = allVerdicts[`${v.key}:${c.id}`]
        if (!j) return []
        return [
          {
            id: c.id,
            verdict: j.verdict,
            ...(j.own ? { own: j.own } : {}),
            t: c.at ?? 0,
            planStep: c.planStep ?? null,
            chose: c.chose,
            judgedAt: j.at,
          },
        ]
      })

  // the comments left as it played: notes at their moment, as the player's are
  for (const c of (await read($, comments))[v.key] ?? []) {
    const f = [...all].reverse().find(x => (x.start ?? 0) <= c.t) ?? all[0]
    annotations.push({
      id: c.id,
      kind: 'note',
      comment: c.text,
      t: c.t,
      frame: frameRef(f),
      plan: { component: null, questions: [], step: f?.planStep ?? null },
    })
  }

  if (verdict === 'approve') {
    annotations.push({
      id: randomId(),
      kind: 'approve',
      comment: '',
      t: map.totalSeconds ?? 0,
      frame: frameRef(all[all.length - 1]),
      plan: { component: null, questions: [], step: null },
    })
  }

  const project = map.project ?? v.which
  const review = {
    version: 1,
    src: `${v.slug}/${v.which}/index.html`,
    project,
    exportedAt: now,
    client: 'claude-code',
    decisions,
    quizzes: [],
    autonomy,
    questions: [],
    verdict,
    annotations,
  }
  return {
    status: 'submitted',
    submittedAt: now,
    project,
    planDir: v.inPlans ? `.reelplanner/plans/${v.slug}` : (map.planDir ?? ''),
    title: map.title ?? v.slug,
    verdict,
    note,
    review,
  }
}

/**
 * After Send, look every few seconds for the new version: the video's plan map written after the Send (a rebuild
 * writes it anew), or, after a plan's approval, its walkthrough's. Found, the pane redraws with it (and says so);
 * the look stops then, after an hour, or when the module reloads.
 */
const watching = new Map<string, { cancel: () => void }>()
function watchForRebuild($: EngineInterface, v: Video, sentAt: number, verdict: 'approve' | 'changes') {
  watching.get(v.key)?.cancel()
  const target = verdict === 'approve' && v.inPlans && v.which === 'video' ? v.dir.replace(/\/video$/, '/walkthrough-video') : v.dir
  let ticks = 0
  const timer = $.clock.every(5000, () => {
    void (async () => {
      ticks++
      let built = 0
      try {
        built = (await $.fs.stat(`${target}/plan-map.json`)).mtimeMs
      } catch {}
      if (built > sentAt + 1000) {
        timer.cancel()
        watching.delete(v.key)
        await update($, sent, s => {
          const was = s[v.key]
          return was ? { ...s, [v.key]: { ...was, rebuiltAt: built } } : s
        })
        $.ui.toast(target === v.dir ? 'The new version of the video is ready: Watch what changed.' : 'The walkthrough video is ready.')
      } else if (ticks > 720) {
        timer.cancel()
        watching.delete(v.key)
      }
    })()
  })
  watching.set(v.key, timer)
}

/** `<project>-<submittedAt>`, as scripts/lib/inbox.mjs names a row. */
const rowId = (project: string, submittedAt: string) =>
  `${project}-${submittedAt.replace(/[-:]/g, '').replace(/\.\d+/, '')}`.replace(/[^A-Za-z0-9._-]+/g, '-')

async function send($: EngineInterface, v: Video, verdict: 'approve' | 'changes') {
  const root = await $.session.root()
  const row = await buildRow($, v, verdict)
  const id = rowId(row.project, row.submittedAt)
  const inbox = `${root}/.reelplanner/inbox`
  const path = `${inbox}/${id}.json`
  await $.fs.write(path, JSON.stringify(row, null, 2) + '\n')

  // A session already waiting (`review --wait`, its heartbeat fresh) claims the row itself.
  const now = await $.clock.now()
  let waiting = false
  try {
    waiting = (await $.fs.list(`${inbox}/.waiters`)).some(w => now - w.mtimeMs < 10_000)
  } catch {}

  const record: ReelplannerSent = { at: row.submittedAt, path, how: waiting ? 'waiter' : 'prompt', verdict }
  await update($, sent, s => ({ ...s, [v.key]: record }))
  watchForRebuild($, v, Date.parse(row.submittedAt), verdict)
  if (waiting) {
    $.ui.toast('Review sent: the waiting session picks it up.')
    return
  }
  const { said } = await cli($, root)
  const kind = isPlanVideo(v.which) ? 'plan video' : 'walkthrough video'
  await $.prompt.submit({
    text:
      `I reviewed the ${kind} of "${row.title}" in the reel pane (verdict: ${verdict}). ` +
      `The review row is in the inbox: ${path}. Claim it (\`${said} review --wait --timeout 5\`), ` +
      `file it with \`${said} reel-intake <path>\`, act on it as the plan-to-video skill says for a review ` +
      `that comes back, and run \`${said} inbox done ${id}\`.`,
  })
  $.ui.toast('Review sent to Claude.')
}

// --- the full player ------------------------------------------------------------------------------

async function openPlayer($: EngineInterface, v: Video) {
  const root = await $.session.root()
  if (await isCloud($)) {
    // localhost in the container is out of the reviewer's reach: the player goes up as an Artifact.
    const { said } = await cli($, root)
    await update($, publishing, () => v.key)
    await $.prompt.submit({
      text:
        `Publish the reelplanner review player for ${v.dir} as a private Artifact so I ` +
        `can watch it from here: pack it with \`${said} bundle-player\` (see its --help; ` +
        `\`${said} reel rebuild\` first if its narration is missing), publish the bundle's page with its files ` +
        `and the \`db\` capability as docs/hosted-review.md describes, and give me the link.`,
    })
    return
  }
  await update($, busy, () => 'Opening the player…')
  try {
    const { argv } = await cli($, root)
    const ran = await $.process.run([...argv, 'review', '--detach', v.dir], { cwd: root, timeoutMs: 180_000 })
    const url = `${ran.stdout}\n${ran.stderr}`.match(/review page:\s*(\S+)/)?.[1]
    if (url) {
      await update($, links, l => ({ ...l, [v.key]: url }))
      $.ui.toast(`Player open at ${url}`)
    } else {
      $.ui.toast(`reelplanner review exited ${ran.exitCode}: ${(ran.stderr || ran.stdout).trim().slice(-200)}`)
    }
  } catch (err) {
    $.ui.toast(`Could not start the player: ${String(err)}`)
  } finally {
    await update($, busy, () => null)
  }
}

type Target = { slug: string; which?: ReelplannerWhich; dir?: string }

/**
 * The keys to the pane, on `key`: a field just opened gets what is typed next, and after one closes the next key
 * is the pane's again. An Input's autoFocus alone is not enough (a field opened from a card the pane redrew took
 * nothing, and the typing went to the prompt); a pane that lost the keys takes them back by opening with focus.
 */
async function keys($: EngineInterface, key: string) {
  try {
    const moved = await $.ui.focus({ requestId: PANE, key })
    if (!moved.deny) return
    await $.ui.open(paneArgs(await read($, theater), true))
    await $.ui.focus({ requestId: PANE, key })
  } catch {
    // no surface holds keys here (a remote one): nothing to move
  }
}

async function openPane($: EngineInterface, target?: Target, asked = true) {
  const plans = await scanLibrary($)
  await update($, library, () => plans)
  await stopPlayback($)
  if (target) {
    const plan = plans.find(p => p.slug === target.slug)
    const which = target.which ?? (plan ? defaultWhich(plan) : 'video')
    await update($, open, () => ({ slug: target.slug, which, stop: 0, ...(target.dir ? { dir: target.dir } : {}) }))
  } else {
    await update($, open, () => null)
  }
  // asked (the command, a press): the pane takes the keys, so its hotkeys work at once; Esc gives them back
  const big = await read($, theater)
  const opened = await $.ui.open(paneArgs(big, asked))
  if (target && asked) {
    const root = await $.session.root()
    const o = await read($, open)
    const v = o ? videoOf(root, o) : null
    const surface = await $.session.surface()
    if (v && (await modeFor($, surface)) === 'browser') {
      // a terminal without kitty graphics: the browser player, where the video is sharp (the pane says how to have it here)
      void openPlayer($, v)
    } else if (v) {
      // it plays as it opens, sized to the pane once the pane has drawn (its width is known then). Inline, a pane
      // opened before any drawing saw the terminal's height took the default third: it opens to its rows first
      const sized = Boolean(termRows)
      const start = () => void playTo($, v, 0, screenSize(paneColumns || 80, pictureRoom(big)))
      $.clock.after(250, () => {
        if (inlinePane && !sized && termRows) void $.ui.open(paneArgs(big, true)).then(() => $.clock.after(250, start))
        else start()
      })
    }
  }
  return opened
}

/** `plans/<slug>/video` or `plans/<slug>/walkthrough-video` in a command or an argument. */
function videoIn(text: string): { slug: string; which?: ReelplannerWhich } | null {
  const m = text.match(/plans\/([^/\s'"]+)(?:\/(video|walkthrough-video))?/)
  return m?.[1] ? { slug: m[1], which: m[2] as ReelplannerWhich | undefined } : null
}

const REVIEW_COMMAND = /\b(?:reelplanner(?:\.mjs)?|reelplanning(?:\.mjs)?)\s+review\b(?![^\n]*--(?:wait|stop)\b)/

// --- drawing ----------------------------------------------------------------------------------------

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'reel',
      description: 'Watch a reelplanner video and answer its open choices in a pane',
      argumentHint: '[plan | video-dir]',
    })
    return next(e)
  })

  on('command.run', { command: 'reel' }, async ($, e) => {
    const arg = e.args.trim()
    let target: Target | undefined
    if (arg) {
      target = videoIn(arg) ?? undefined
      if (!target) {
        // a built video's own folder (videos/l2-upload-resume, a plan's video/)
        const root = await $.session.root()
        const dir = (arg.startsWith('/') ? arg : `${root}/${arg}`).replace(/\/+$/, '')
        const map = await loadMap($, dir)
        if (map) {
          const which: ReelplannerWhich = map.project === 'walkthrough-video' ? 'walkthrough-video' : 'video'
          target = { slug: dir.split('/').pop() ?? dir, which, dir }
        }
      }
      if (!target) {
        const plans = await scanLibrary($)
        const hit = plans.find(p => p.slug === arg) ?? plans.find(p => p.slug.includes(arg))
        if (!hit) return { text: `No plan or built video matches "${arg}". /reel lists them.` }
        target = { slug: hit.slug }
      }
    }
    const opened = await openPane($, target)
    return {
      text: opened.isPlaced
        ? 'Opened the reelplanner pane.'
        : `The reelplanner pane is waiting for room (${opened.reason}); widen the window to see it.`,
    }
  })

  // The agent opened a video for review: offer it here, and in a cloud session open the pane, since the
  // localhost page the command started is out of the reviewer's reach.
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    try {
      if (REVIEW_COMMAND.test(e.command)) {
        const found = videoIn(e.command)
        const plans = await scanLibrary($)
        await update($, library, () => plans)
        const plan = found ? plans.find(p => p.slug === found.slug) : plans[0]
        if (plan) {
          const which = found?.which ?? defaultWhich(plan)
          await update($, ready, () => ({ slug: plan.slug, which }))
          const url = JSON.stringify(ran).match(/review page:\s*(http[^\s"\\]+)/)?.[1]
          if (url && !(await isCloud($))) await update($, links, l => ({ ...l, [`${plan.slug}:${which}`]: url }))
          if (await isCloud($)) await openPane($, { slug: plan.slug, which }, false)
        }
      }
    } catch {}
    return ran
  }).catch(($, e, next) => next(e))

  // The player published as an Artifact: keep its link for the pane.
  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    try {
      if (String(e.tool) === 'Artifact') {
        const key = await read($, publishing)
        const url = JSON.stringify(ran).match(/https:\/\/claude\.ai\/[^\s"'\\)]*artifact[^\s"'\\)]*/)?.[0]
        if (key && url) {
          await update($, links, l => ({ ...l, [key]: url }))
          await update($, publishing, () => null)
          $.ui.toast('The player is published: Watch opens it.')
        }
      }
    } catch {}
    return ran
  }).catch(($, e, next) => next(e))

  // the pane closed: the video stops with it (its sound included)
  on('ui.close', { id: PANE }, async ($, e, next) => {
    await stopPlayback($)
    return next(e)
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    termRows = e.viewport?.rows ?? termRows
    const offer = await read($, ready)
    if (!offer || e.props.hasSurvey) return next(e)
    const plan = (await read($, library)).find(p => p.slug === offer.slug)
    if (!plan) return next(e)
    const { Box, Text, Button } = $.ui.resolve(e)
    const n = isPlanVideo(offer.which) ? plan.choices : plan.calls
    const what = isPlanVideo(offer.which) ? `${count(n ?? 0, 'open choice')}` : `${count(n ?? 0, 'call')} to check`
    return (
      <Box gap={1}>
        <Text>
          ▶ {plan.title} <Text dimColor>· {what}</Text>
        </Text>
        <Button
          key="review"
          hotkey="r"
          label="Watch here"
          variant="primary"
          onPress={async () => {
            // the band goes first: closing it after the pane opened would hand the keys back to the prompt
            await update($, ready, () => null)
            await openPane($, offer)
          }}
        />
        <Button key="dismiss" label="Later" role="dismiss" onPress={() => update($, ready, () => null)} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const els = $.ui.resolve(e)
    const { Box, Text, Button, Link } = els
    const Input = 'Input' in els ? els.Input : null
    const width = Math.max(30, e.props.bodyColumns)
    paneColumns = e.props.bodyColumns
    paneRows = e.props.scroll.bodyRows
    inlinePane = e.props.placement === 'inline'
    termRows = e.viewport?.rows ?? termRows
    const root = await $.session.root()
    const shown = await read($, open)
    const working = await read($, busy)
    const terminal = e.surface === 'terminal'

    const plans = await scanLibrary($)
    if (!shown) {
      return (
        <Box flexDirection="column" gap={1}>
          <Text bold>Plans with a video</Text>
          {plans.length === 0 && (
            <Text dimColor>No plan here has a built video yet (.reelplanner/plans/*/video). /reel &lt;video-dir&gt; opens any built video.</Text>
          )}
          {plans.slice(0, 30).map((p, i) => (
            <Box key={`plan-${p.slug}`} flexDirection="column">
              <Button
                key={`open-${p.slug}`}
                plain
                hotkey={i < 9 ? String(i + 1) : undefined}
                onPress={() => openPane($, { slug: p.slug, which: defaultWhich(p) })}
              >
                {p.title}
              </Button>
              <Text dimColor>
                {'  '}
                {p.slug}
                {p.choices !== null && ` · plan video: ${count(p.choices, 'choice')}${p.planReviewed ? ', reviewed' : ', to review'}`}
                {p.calls !== null && ` · walkthrough: ${count(p.calls, 'call')}${p.walkthroughReviewed ? ', reviewed' : ', to review'}`}
              </Text>
            </Box>
          ))}
        </Box>
      )
    }

    const v = videoOf(root, shown)
    const { stop } = shown
    const map = await loadMap($, v.dir)
    const plan = plans.find(p => p.slug === v.slug)
    if (!map) {
      return (
        <Box flexDirection="column">
          <Text>No built video at {v.dir}.</Text>
          <Button key="back" label="‹ All plans" onPress={() => update($, open, () => null)} />
        </Box>
      )
    }
    const stops = stopsOf(map, v.which)
    const allAnswers = await read($, answers)
    const allVerdicts = await read($, verdicts)
    const link = (await read($, links))[v.key]
    const lastSent = (await read($, sent))[v.key]
    const cloud = await isCloud($)
    const pb = await read($, playback)
    const mine = pb?.key === v.key ? pb : null
    const big = await read($, theater)
    // the size the picture plays at; a still picture follows the pane's width (bigger, smaller)
    const size = mine && (mine.status === 'playing' || mine.status === 'rendering') ? { cols: mine.cols, rows: mine.rows } : screenSize(width, pictureRoom(big))
    const using = Boolean(mine) // the video has been played here: moving between stops plays on
    const revision = isRevision(map)
    const only = revision && (await read($, onlyChanges))[v.key] !== false
    const trimmed = (list: { from: number; to: number }[]) => (only ? changedOnly(map, list, id => done(id)) : list)
    const go = async (to: number, from?: number, branch?: Branch) => {
      let i = Math.max(0, Math.min(stops.length, to))
      const start = from ?? stretch(map, v.which, i).from
      // just the changes: going on, a choice already answered is not stopped at again (going back to one is)
      if (only && to > stop) i = nextOpen(i)
      await update($, open, o => (o ? { ...o, stop: i } : o))
      if (!using) return
      const s = stretch(map, v.which, i)
      // the clip the answer picked always plays; what follows it, just the changes when that mode is on
      const list = [...(branch ? [{ from: branch.start, to: branch.end }] : []), ...trimmed([{ from: start, to: s.to }])]
      branchOf = branch ? { key: v.key, stop: i, end: branch.end } : null
      void play($, v, list, size)
    }
    /** What plays on from `from`: the rest of an answer's branch clip first, if it is in one. */
    const onFrom = (from: number) => {
      const s = stretch(map, v.which, stop)
      if (branchOf && branchOf.key === v.key && branchOf.stop === stop && from < branchOf.end)
        return [{ from, to: branchOf.end }, ...trimmed([{ from: s.from, to: s.to }])]
      return trimmed([{ from: from > s.from && from < s.to - 0.2 ? from : s.from, to: s.to }])
    }
    const done = (id: string) =>
      isPlanVideo(v.which) ? Boolean(allAnswers[`${v.key}:${id}`]) : Boolean(allVerdicts[`${v.key}:${id}`])
    /** The first stop from `i` on not answered yet (the end, the Send card, when all are). */
    const nextOpen = (i: number) => {
      let j = i
      while (j < stops.length && stops[j] && done(stops[j]!.id)) j++
      return j
    }
    const other: ReelplannerWhich = isPlanVideo(v.which) ? 'walkthrough-video' : 'video'
    const hasOther = v.inPlans && plan ? (isPlanVideo(v.which) ? plan.calls !== null : plan.choices !== null) : false

    // --- the pane, top to bottom: the picture; the transport (timeline, keys, time); the stage (the choice the
    // video stopped at, or what comes next); the review so far (answers and comments, by time); hints -----------
    const playing = mine?.status === 'playing'
    const rendering = mine?.status === 'rendering'
    const stopped = !playing && !rendering // the card for this stop shows only while the video is still
    const toggle = () => {
      if (playing) return stopPlayback($)
      return play($, v, onFrom(mine ? mine.t : stretch(map, v.which, stop).from), size)
    }
    const mode = mine?.mode ?? (await modeFor($, e.surface))
    // a terminal without kitty graphics watches it in the browser player
    const inBrowser = mode === 'browser'
    const total = map.totalSeconds ?? 0
    /** j and k: back or on 5 seconds, as the browser player's arrow keys. Playing, it plays on from there (just the
     * changes still skip what did not change); paused, it shows the frame there and stays paused. */
    const seek = async (by: number) => {
      if (inBrowser) return
      const t0 = mine?.t ?? stretch(map, v.which, stop).from
      let t1 = Math.max(0, Math.min(total - 0.1, t0 + by))
      // the stop whose stretch holds the moment. Between a choice and where the video resumes after it are the
      // answers' own clips: going on lands where it resumes, going back just before the choice
      let i = stops.length
      for (let j = 0; j <= stops.length; j++) {
        const s = stretch(map, v.which, j)
        if (t1 >= s.to && j < stops.length) continue
        if (t1 >= s.from) {
          i = j
        } else if (by > 0 || j === 0) {
          i = j
          t1 = s.from
        } else {
          const before = stretch(map, v.which, j - 1)
          i = j - 1
          t1 = Math.max(before.from, before.to - 0.5)
        }
        break
      }
      if (i !== stop) await update($, open, o => (o ? { ...o, stop: i } : o))
      const s = stretch(map, v.which, i)
      branchOf = null
      if (playing || rendering) return void play($, v, trimmed([{ from: t1, to: s.to }]), size)
      return void play($, v, [{ from: t1, to: Math.min(s.to, t1 + 0.2) }], size, { still: true })
    }
    /** v: switch between just the changes and the whole video, and play on in the new mode, as the browser
     * player's toggle does: from here, or from the start when the video is at its end. */
    const switchOnly = async () => {
      const next = !only
      await update($, onlyChanges, o => ({ ...o, [v.key]: next }))
      if (inBrowser) return
      const atEnd = !mine || mine.t >= total - 0.5
      // the stop whose stretch the video is in (after just the changes ran past several, not the one it stopped at)
      let here = stop
      for (let j = 0; mine && j <= stops.length; j++) {
        const s = stretch(map, v.which, j)
        if (mine.t >= s.from && mine.t < s.to - 0.2) here = j
      }
      const i = atEnd ? (next ? nextOpen(0) : 0) : next ? nextOpen(here) : here
      if (i !== stop) await update($, open, o => (o ? { ...o, stop: i } : o))
      const s = stretch(map, v.which, i)
      const from = atEnd ? (next ? 0 : s.from) : mine.t >= stretch(map, v.which, here).from && mine.t < s.to - 0.2 ? mine.t : s.from
      const list = [{ from, to: s.to }]
      branchOf = null
      void play($, v, next ? changedOnly(map, list, id => done(id)) : list, size)
    }
    const t = mine?.t ?? stretch(map, v.which, stop).from
    const dim = (s: string) => <Text dimColor>{s}</Text>
    const heading = (s: string) => (
      <Text dimColor bold>
        {s.toUpperCase()}
      </Text>
    )

    const header = (
      <Box key="header" justifyContent="space-between" gap={1}>
        <Text bold wrap="truncate-end">
          {map.title ?? v.slug}
        </Text>
        <Box gap={2}>
          {hasOther && (
            <Button key="other" plain onPress={() => openPane($, { slug: v.slug, which: other })}>
              {isPlanVideo(v.which) ? 'Walkthrough' : 'Plan video'}
            </Button>
          )}
          <Button key="library" plain hotkey="l" onPress={() => stopPlayback($).then(() => update($, open, () => null))}>
            All plans
          </Button>
        </Box>
      </Box>
    )
    const mins = (n: number) => (n >= 60 ? `${Math.floor(n / 60)}m ${Math.round(n % 60)}s` : `${Math.round(n)}s`)
    const revised = revision ? (
      <Box key="revised" gap={1} flexWrap="wrap">
        <Text color="suggestion">
          Revised since the last build: {map.changes?.changedFrames?.length} of {(map.frames ?? []).length} scenes changed (
          {mins(map.changes?.changedSeconds ?? 0)}). {only ? 'Plays just the changes.' : 'Plays the whole video.'}
        </Text>
        <Button key="only" plain hotkey="v" onPress={() => switchOnly()}>
          {only ? 'Whole video' : 'Just the changes'}
        </Button>
      </Box>
    ) : null

    // the picture: the video in the pane, or, in a terminal without kitty graphics, where it plays instead
    let picture: RenderElement
    if (inBrowser) {
      picture = (
        <Box borderStyle="round" borderDimColor flexDirection="column" paddingX={1}>
          <Text bold>▶ The video plays in your browser</Text>
          {link ? <Link href={link} label={link} /> : dim(working ?? 'opening the player…')}
          <Box gap={2} marginTop={1} flexWrap="wrap">
            <Button key="watch" plain hotkey="w" onPress={() => openPlayer($, v)}>
              Open it again
            </Button>
          </Box>
          {dim('To watch it here in the pane, open Claude Code in kitty or Ghostty: they draw the video itself.')}
        </Box>
      )
    } else if (e.surface === 'terminal') {
      const tt = $.ui.resolve(e)
      picture = (
        <Box justifyContent="center">
          <tt.Image key="screen" source={pictures.get(v.key) ?? { rgba: 'AAAA/w==', width: 1, height: 1 }} columns={size.cols} rows={size.rows} alt={map.title ?? 'the video'} />
        </Box>
      )
    } else {
      const svg = mine ? await read($, flip) : null
      picture =
        'Svg' in els && svg ? (
          <els.Svg source={svg} alt={map.title ?? 'the video'} width={Math.min(480, width * 8)} />
        ) : (
          dim('▶ The video plays here, a few frames a second. With its sound: w, the full player.')
        )
    }
    const captions = await loadCaptions($, v.dir)
    // the captions under the picture where its own are too small to read (the few-frames Svg)
    const caption = playing && mode === 'jpeg' ? captions.find(c => c.start <= t + 0.05 && t < c.end)?.text : undefined

    // the timeline: what has played, the playhead, and a mark at each stop (filled once answered)
    const cols = size.cols
    const marks = new Map<number, Decision | Call>()
    for (const s of stops) if (total > 0 && s.at !== undefined) marks.set(Math.min(cols - 1, Math.floor((s.at / total) * cols)), s)
    const notesHere = (await read($, comments))[v.key] ?? []
    const noted = new Set(notesHere.map(c => (total > 0 ? Math.min(cols - 1, Math.floor((c.t / total) * cols)) : 0)))
    const head = total > 0 ? Math.min(cols - 1, Math.floor((t / total) * cols)) : 0
    const cells: { ch: string; kind: 'played' | 'head' | 'rest' | 'done' | 'open' | 'here' | 'note' }[] = []
    for (let i = 0; i < cols; i++) {
      const s = marks.get(i)
      if (s) cells.push({ ch: done(s.id) ? '◆' : '◇', kind: s === stops[stop] ? 'here' : done(s.id) ? 'done' : 'open' })
      else if (i === head) cells.push({ ch: '●', kind: 'head' })
      else if (noted.has(i)) cells.push({ ch: '▴', kind: 'note' })
      else cells.push({ ch: i < head ? '━' : '─', kind: i < head ? 'played' : 'rest' })
    }
    const runs: { text: string; kind: (typeof cells)[number]['kind'] }[] = []
    for (const c of cells) {
      const last = runs[runs.length - 1]
      if (last && last.kind === c.kind) last.text += c.ch
      else runs.push({ text: c.ch, kind: c.kind })
    }
    const color = { played: 'claude', head: 'claude', done: 'success', here: 'warning', note: 'suggestion' } as const
    const timeline = (
      <Text key="timeline" wrap="truncate-end">
        {runs.map((r, i) =>
          r.kind === 'rest' ? (
            <Text key={`r${i}`} dimColor>{r.text}</Text>
          ) : r.kind === 'open' ? (
            <Text key={`r${i}`} bold>{r.text}</Text>
          ) : (
            <Text key={`r${i}`} color={color[r.kind]} bold={r.kind === 'here'}>{r.text}</Text>
          ),
        )}
      </Text>
    )
    const where = !mine
      ? ''
      : rendering
        ? `preparing the video for this terminal, once · ${mine.progress ?? 0}%`
        : mine.status === 'failed'
          ? `could not play: ${mine.message ?? ''}`
          : playing
            ? mine.audio && !mine.audio.startsWith('none') ? 'playing · sound on' : 'playing'
            : mine.status === 'ended' && stop < stops.length
              ? `stopped at ${isPlanVideo(v.which) ? 'choice' : 'call'} ${stop + 1}`
              : mine.status === 'ended'
                ? 'the end'
                : 'paused'

    // a comment at this moment: the video waits while it is written, and plays on after
    const writing = await read($, composing)
    const commenting = writing === `${v.key}:comment`
    // where the comment is: the moment the pane's video is at, or, while the video plays in the browser (where
    // the pane cannot see), the choice the pane is on
    const commentT = inBrowser ? (stops[stop]?.at ?? total) : t
    const startComment = async () => {
      commentAt = { key: v.key, t: commentT, resume: playing ? onFrom(t) : null }
      if (playing) await stopPlayback($)
      await update($, composing, () => `${v.key}:comment`)
      await keys($, 'comment-field')
    }
    const saveComment = async (text: string) => {
      const at = commentAt?.key === v.key ? commentAt : { key: v.key, t, resume: null }
      commentAt = null
      await update($, composing, () => null)
      if (text) {
        const c: ReelplannerComment = { id: randomId(), t: at.t, text, at: new Date(await $.clock.now()).toISOString() }
        await update($, comments, all => ({ ...all, [v.key]: [...(all[v.key] ?? []), c] }))
      }
      if (at.resume) void play($, v, at.resume, size)
      await keys($, inBrowser ? 'next' : 'play')
    }

    // a comment on an answer given ("Postgres, but only if…"): from the card, or while its part of the video plays
    const noteOpen = (id: string) => writing === `${v.key}:note-${id}`
    const startNote = async (id: string) => {
      commentAt = { key: v.key, t, resume: playing ? onFrom(t) : null }
      if (playing) await stopPlayback($)
      await update($, composing, () => `${v.key}:note-${id}`)
      await keys($, `note-${id}`)
    }
    const saveNote = async (id: string, text: string) => {
      const at = commentAt?.key === v.key ? commentAt : null
      commentAt = null
      await update($, composing, () => null)
      await update($, answers, all => {
        const a = all[`${v.key}:${id}`]
        if (!a) return all
        const { note: _, ...rest } = a
        return { ...all, [`${v.key}:${id}`]: text ? { ...rest, note: text } : rest }
      })
      if (at?.resume) void play($, v, at.resume, size)
      await keys($, inBrowser ? 'next' : 'play')
    }
    const noteControls = (id: string, a: ReelplannerAnswer | undefined) =>
      Input && a ? (
        <Box key={`note-box-${id}`} flexDirection="column">
          <Button key="answer-note" plain hotkey="c" onPress={() => (noteOpen(id) ? update($, composing, () => null) : startNote(id))}>
            {a.note ? 'Change your comment on this answer' : 'Add a comment to this answer'}
          </Button>
          {noteOpen(id) && (
            <Input
              key={`note-${id}`}
              label={`Comment on ${a.label}`}
              placeholder="why, or with what condition; Enter (the video waits)"
              value={a.note ?? ''}
              autoFocus
              onSubmit={value => saveNote(id, value.trim())}
            />
          )}
        </Box>
      ) : null

    // bigger: the docked pane asks for most of the terminal's width (a width the person dragged it to wins), the
    // review below the picture folds away, and a playing video goes on at the new size
    const toggleBig = async () => {
      const next = !big
      await update($, theater, () => next)
      await $.ui.open(paneArgs(next, true, e.viewport?.columns ?? 200))
      if (playing && mine) {
        const from = mine.t
        $.clock.after(300, () => void play($, v, onFrom(from), screenSize(paneColumns || width, pictureRoom(next))))
      }
    }
    const transport = inBrowser ? (
      <Box key="transport" gap={2}>
        <Button key="prev" plain hotkey="b" onPress={() => go(stop - 1)}>
          Back
        </Button>
        <Button key="next" plain hotkey="n" onPress={() => go(stop + 1)}>
          {stop >= stops.length - 1 ? 'To Send' : 'Next'}
        </Button>
        <Text dimColor>
          {stop < stops.length ? `${isPlanVideo(v.which) ? 'choice' : 'call'} ${stop + 1} of ${stops.length}` : 'send'}
        </Text>
      </Box>
    ) : (
      <Box key="transport" flexDirection="column">
        {mode === 'jpeg' && (
          <Text bold wrap="truncate-end">
            {caption ?? ' '}
          </Text>
        )}
        {timeline}
        <Box justifyContent="space-between" gap={1} flexWrap="wrap">
          <Box gap={2}>
            <Button key="play" plain hotkey="p" onPress={() => toggle()}>
              {playing || rendering ? 'Pause' : 'Play'}
            </Button>
            <Button key="replay" plain hotkey="r" onPress={() => playTo($, v, stop, size)}>
              Replay
            </Button>
            <Button key="back5" plain hotkey="j" onPress={() => seek(-5)}>
              −5s
            </Button>
            <Button key="on5" plain hotkey="k" onPress={() => seek(5)}>
              +5s
            </Button>
            <Button key="prev" plain hotkey="b" onPress={() => go(stop - 1)}>
              Back
            </Button>
            <Button key="next" plain hotkey="n" onPress={() => go(stop + 1)}>
              {stop >= stops.length - 1 ? 'To Send' : 'Next'}
            </Button>
            {e.surface === 'terminal' && (
              <Button key="big" plain hotkey="z" onPress={() => toggleBig()}>
                {big ? 'Smaller' : 'Bigger'}
              </Button>
            )}
          </Box>
          <Text dimColor>
            {clock(t)} / {clock(total)}
            {where ? ` · ${where}` : ''}
          </Text>
        </Box>
      </Box>
    )

    // own words for a choice or a call: a field opened on asking, so the card stays a short list of keys
    const ownField = (id: string, label: string, onSubmit: (text: string) => unknown) =>
      Input && writing === `${v.key}:${id}` ? (
        <Input
          key={`own-${id}`}
          label={label}
          placeholder="type, then Enter"
          autoFocus
          onSubmit={async value => {
            await update($, composing, () => null)
            if (value.trim()) await onSubmit(value.trim())
            await keys($, inBrowser ? 'next' : 'play')
          }}
        />
      ) : null
    const ownButton = (id: string, label: string) =>
      Input ? (
        <Button
          key="own"
          plain
          hotkey="o"
          onPress={async () => {
            const opening = writing !== `${v.key}:${id}`
            await update($, composing, () => (opening ? `${v.key}:${id}` : null))
            if (opening) await keys($, `own-${id}`)
          }}
        >
          {label}
        </Button>
      ) : null

    // the review so far: each answer at its choice, each comment at its moment, in the video's order
    const log: { t: number; key: string; line: RenderElement }[] = []
    stops.forEach((s, i) => {
      const a = isPlanVideo(v.which) ? allAnswers[`${v.key}:${s.id}`] : undefined
      const j = isPlanVideo(v.which) ? undefined : allVerdicts[`${v.key}:${s.id}`]
      if (!a && !j) return
      const said = a ? a.label : j ? (j.verdict === 'own' ? `instead: ${j.own}` : j.verdict === 'accept' ? 'accepted' : 'flagged') : ''
      log.push({
        t: s.at ?? 0,
        key: `log-${s.id}`,
        line: (
          <Text key={`log-${s.id}`} wrap="truncate-end">
            <Text color="success">◆ </Text>
            <Text dimColor>{clock(s.at)} </Text>
            {isPlanVideo(v.which) ? 'Choice' : 'Call'} {i + 1} <Text dimColor>→</Text> <Text bold>{said}</Text>
            {a?.note ? <Text>, “{a.note}”</Text> : ''}
          </Text>
        ),
      })
    })
    for (const c of notesHere) {
      log.push({
        t: c.t,
        key: `log-${c.id}`,
        line: (
          <Text key={`log-${c.id}`} wrap="truncate-end">
            <Text color="suggestion">▴ </Text>
            <Text dimColor>{clock(c.t)} </Text>
            {c.text}
          </Text>
        ),
      })
    }
    log.sort((a, b) => a.t - b.t)
    const review = (
      <Box key="review" flexDirection="column">
        <Box justifyContent="space-between" gap={1}>
          {heading(`Your review · ${log.length === 0 ? 'nothing yet' : count(log.length, 'item')}`)}
          {Input && (
            <Button key="comment" plain hotkey="m" onPress={() => startComment()}>
              {inBrowser ? `Comment on ${stop < stops.length ? `${isPlanVideo(v.which) ? 'choice' : 'call'} ${stop + 1}` : 'the video'}` : `Comment at ${clock(t)}`}
            </Button>
          )}
        </Box>
        {log.length === 0 && dim(inBrowser ? 'Answers land here as you give them; m leaves a comment.' : 'Answers land here as you give them; m leaves a comment at the moment the video is at.')}
        {log.map(x => x.line)}
        {Input && commenting && (
          <Input
            key="comment-field"
            label={inBrowser ? 'Comment' : `Comment at ${clock(commentAt?.t ?? t)}`}
            placeholder="type, then Enter (the video waits)"
            autoFocus
            onSubmit={value => saveComment(value.trim())}
          />
        )}
      </Box>
    )
    const hints = (
      <Box key="hints" flexDirection="column">
        {!inBrowser && (
          <Text dimColor wrap="wrap">
            Drawing on the video (a circle, a box) is in the browser player:{' '}
            {link ? <Text>{link}</Text> : <Text>w</Text>}
            {link ? '' : ' opens it.'}
          </Text>
        )}
        {!inBrowser && !link && (
          <Button key="watch" plain hotkey="w" onPress={() => openPlayer($, v)}>
            {cloud ? 'Full player, with sound (Artifact)' : 'Full player (browser)'}
          </Button>
        )}
      </Box>
    )
    const layout = (stage: RenderElement | null) => (
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          {header}
          {revised}
          {picture}
          {transport}
          {working && !inBrowser && dim(working)}
        </Box>
        {stage}
        {big ? dim(`Your review: ${count(log.length, 'item')} · z shows it again`) : review}
        {big && e.props.placement === 'dock'
          ? dim('The dock goes no wider than this. For the video across the whole terminal, start Claude Code with CLAUDE_CODE_NO_FLICKER=0: the pane opens above the prompt, and z gives it all but the prompt.')
          : null}
        {big ? null : hints}
      </Box>
    )

    // --- the end: send it, and after: what Claude is doing with it, and the new version when it is built --------
    if (stop >= stops.length) {
      const left = stops.filter(s => !done(s.id)).length
      const note = (await read($, notes))[v.key] ?? ''
      const plan = isPlanVideo(v.which)
      // what each answer leads to, said before it is given
      const means = plan
        ? {
            approve: 'the plan is right. Claude folds your answers and comments into it and builds it. No new plan video: next comes the walkthrough of what was built, here.',
            changes: 'Claude revises the plan from your answers and comments, rebuilds the scenes that change, and the new version comes back here, playing just what changed.',
          }
        : {
            approve: 'the build stands. Accepted calls join the decision log; any comments are applied, with no new video.',
            changes: 'Claude fixes the calls you flagged or answered, rebuilds the scenes those fixes touch, and the new version comes back here to check.',
          }
      // after Send: the video is rebuilt in place (its folder, its plan map written anew), so a plan map newer than
      // the Send is the new version
      const sentAt = lastSent ? Date.parse(lastSent.at) : 0
      const rebuilt = lastSent ? builtAt(v.dir) > sentAt + 1000 : false
      const walkDir = v.inPlans ? `${plansDir(root)}/${v.slug}/walkthrough-video` : null
      const walk = walkDir && plan ? await loadMap($, walkDir) : null
      const walkReady = Boolean(walk && walkDir && builtAt(walkDir) > sentAt + 1000)
      // the new version from its start, just what changed, stopping only at choices not answered yet
      const watchNew = async () => {
        await update($, onlyChanges, o => ({ ...o, [v.key]: true }))
        const i = nextOpen(0)
        await update($, open, o => (o ? { ...o, stop: i } : o))
        const fresh = await loadMap($, v.dir)
        const list = [{ from: 0, to: stretch(fresh ?? map, v.which, i).to }]
        void play($, v, isRevision(fresh ?? map) ? changedOnly(fresh ?? map, list, id => done(id)) : list, screenSize(paneColumns || width, pictureRoom(big)))
      }
      const after = lastSent ? (
        <Box borderStyle="round" borderColor={rebuilt || walkReady ? 'success' : 'claude'} flexDirection="column" paddingX={1}>
          <Text color={rebuilt || walkReady ? 'success' : 'claude'} bold>
            {lastSent.verdict === 'approve' ? 'Approved' : 'Changes asked for'} · sent {lastSent.at.slice(11, 16)}
          </Text>
          {lastSent.verdict === 'changes' ? (
            rebuilt ? (
              <Box flexDirection="column">
                <Text>
                  The new version is ready
                  {isRevision(map) ? `: ${map.changes?.changedFrames?.length} of ${(map.frames ?? []).length} scenes changed` : ''}.
                </Text>
                <Button key="watch-new" plain hotkey="g" onPress={() => watchNew()}>
                  <Text color="success" bold>Watch what changed</Text>
                </Button>
              </Box>
            ) : (
              dim(`Claude is revising the plan and rebuilding the scenes that change. This pane stays here; the new version replaces this one when it is built, and opens here to play just what changed.`)
            )
          ) : plan ? (
            walkReady ? (
              <Button key="watch-walk" plain hotkey="g" onPress={() => openPane($, { slug: v.slug, which: 'walkthrough-video' })}>
                <Text color="success" bold>The walkthrough is ready: watch it</Text>
              </Button>
            ) : (
              dim('Claude is folding your comments into the plan and building it. The walkthrough video, of what was built and the calls made on the way, opens here when it is ready.')
            )
          ) : (
            dim('Nothing more to watch for this build.')
          )}
          {dim(`${lastSent.how === 'waiter' ? 'The waiting session' : 'This session'} has it: ${lastSent.path.replace(`${root}/`, '')}`)}
        </Box>
      ) : null
      return layout(
        <Box flexDirection="column" gap={1}>
          {after}
          <Box borderStyle="round" borderColor={lastSent ? undefined : 'claude'} borderDimColor={Boolean(lastSent)} flexDirection="column" paddingX={1}>
            <Text color={lastSent ? undefined : 'claude'} dimColor={Boolean(lastSent)} bold>
              {lastSent ? 'Send again' : 'Send your review'}
            </Text>
            <Text>
              {count(stops.length - left, plan ? 'choice' : 'call')} answered
              {notesHere.length ? `, ${count(notesHere.length, 'comment')}` : ''}
              {left > 0 ? <Text color="warning"> · {left} not answered: {plan ? 'they stay open questions' : 'they go on as the agent decided'}</Text> : ''}
            </Text>
            {note && dim(`Note for the agent: ${note}`)}
            <Box flexDirection="column" marginTop={1}>
              <Button key="approve" plain hotkey="a" onPress={() => send($, v, 'approve')}>
                <Text color="success" bold>
                  Approve
                </Text>
              </Button>
              <Text dimColor>{'   '}{means.approve}</Text>
              <Button key="changes" plain hotkey="c" onPress={() => send($, v, 'changes')}>
                <Text bold>Changes needed</Text>
              </Button>
              <Text dimColor>{'   '}{means.changes}</Text>
            </Box>
            <Box marginTop={1}>{ownButton('note', note ? 'Change the note' : 'Add a note for the agent')}</Box>
            {ownField('note', 'A note for the agent', text => update($, notes, n => ({ ...n, [v.key]: text })))}
          </Box>
        </Box>,
      )
    }

    const s = stops[stop]
    if (!s) return layout(null)

    // while it plays: what comes next, and what was just picked
    const prev = stops[stop - 1]
    const prevDecision = prev && 'question' in prev ? allAnswers[`${v.key}:${prev.id}`] : undefined
    const prevAnswer = prev ? (prevDecision?.label ?? allVerdicts[`${v.key}:${prev.id}`]?.verdict) : undefined
    // just answered: its part of the video plays, and a comment on the answer is a key away
    // inside the clip of the answer just given (playing or paused there), the stage stays on that answer
    const inBranch = Boolean(prevAnswer) && t < stretch(map, v.which, stop).from - 0.05
    const justAnswered = inBranch || (prev ? noteOpen(prev.id) : false)
    const upNext = (
      <Box borderStyle="round" borderDimColor flexDirection="column" paddingX={1}>
        {justAnswered ? (
          <Box flexDirection="column">
            <Text color="success">
              ◆ {prevAnswer}
              {prevDecision?.note ? `, “${prevDecision.note}”` : ''}: its part of the video plays, then on
            </Text>
            {prev && prevDecision ? noteControls(prev.id, prevDecision) : null}
          </Box>
        ) : null}
        <Text dimColor>
          Up next · {isPlanVideo(v.which) ? 'choice' : 'call'} {stop + 1} of {stops.length} · at {clock(s.at)}
        </Text>
        <Text wrap="truncate-end">{'question' in s ? s.question : s.chose}</Text>
      </Box>
    )

    if ('question' in s) {
      const q = s
      const a = allAnswers[`${v.key}:${q.id}`]
      const answer = async (next: Omit<ReelplannerAnswer, 'at'>, o?: Option) => {
        const at = new Date(await $.clock.now()).toISOString()
        await update($, answers, all => ({ ...all, [`${v.key}:${q.id}`]: { ...next, at } }))
        // the branch the answer picked plays, then the video goes on from where the question resumes
        await go(stop + 1, q.resumeAt ?? q.at, o?.branch)
      }
      const toggleOption = async (o: Option) => {
        const ids = new Set(a?.option === 'multi' ? a.options : [])
        if (ids.has(o.id)) ids.delete(o.id)
        else ids.add(o.id)
        const chosen = q.options.filter(x => ids.has(x.id))
        const at = new Date(await $.clock.now()).toISOString()
        const label = chosen.map(x => x.label).join(' + ')
        await update($, answers, all => ({
          ...all,
          [`${v.key}:${q.id}`]: { option: 'multi', options: chosen.map(x => x.id), labels: chosen.map(x => x.label), label, at },
        }))
      }
      const isChosen = (o: Option) => (a?.option === 'multi' ? (a.options ?? []).includes(o.id) : a?.option === o.id)
      if (!stopped || justAnswered) return layout(upNext)
      return layout(
        <Box borderStyle="round" borderColor="claude" flexDirection="column" paddingX={1}>
          <Text color="claude" bold>
            Choice {stop + 1} of {stops.length}
            {q.planStep ? ` · step ${q.planStep}` : ''}
            {q.kind === 'multi' ? ' · pick any' : ''}
          </Text>
          <Text bold>{q.question}</Text>
          {q.questionMore && dim(q.questionMore)}
          <Box flexDirection="column" marginTop={1}>
            {q.options.map((o, i) => (
              <Box key={`o-${o.id}`} flexDirection="column">
                <Button
                  key={`opt-${o.id}`}
                  plain
                  hotkey={i < 9 ? String(i + 1) : undefined}
                  onPress={() => (q.kind === 'multi' ? toggleOption(o) : answer({ option: o.id, label: o.label }, o))}
                >
                  <Text bold={isChosen(o)}>{o.label}</Text>
                  {o.recommended ? <Text color="success"> ★ recommended</Text> : ''}
                  {isChosen(o) ? <Text color="success"> ✓ your answer</Text> : ''}
                </Button>
                {o.why && <Text dimColor>{'   '}{o.why}</Text>}
              </Box>
            ))}
          </Box>
          <Box gap={2} marginTop={1} flexWrap="wrap">
            <Button key="unclear" plain hotkey="e" onPress={() => answer({ option: 'unclear', label: 'Explain this more' })}>
              {a?.option === 'unclear' ? <Text bold>Explain this more ✓</Text> : 'Explain this more'}
            </Button>
            {ownButton(q.id, a?.option === 'own' ? 'Change my own answer' : 'Answer in my own words')}
          </Box>
          {ownField(q.id, 'Your answer', text => answer({ option: 'own', label: text }))}
          {a?.option === 'own' && <Text color="success">◆ Your answer: {a.label}</Text>}
          {a?.note && <Text color="success">◆ Your comment: {a.note}</Text>}
          {a ? noteControls(q.id, a) : dim('Pick one, then c adds a comment to your answer.')}
        </Box>,
      )
    }

    const c = s
    const j = allVerdicts[`${v.key}:${c.id}`]
    const judge = async (next: Omit<ReelplannerVerdict, 'at'>) => {
      const at = new Date(await $.clock.now()).toISOString()
      await update($, verdicts, all => ({ ...all, [`${v.key}:${c.id}`]: { ...next, at } }))
      await go(stop + 1, c.at)
    }
    if (!stopped || justAnswered) return layout(upNext)
    return layout(
      <Box borderStyle="round" borderColor="claude" flexDirection="column" paddingX={1}>
        <Text color="claude" bold>
          Call {stop + 1} of {stops.length}
          {c.planStep ? ` · step ${c.planStep}` : ''} · the agent decided this on its own
        </Text>
        <Text bold>{c.chose}</Text>
        {c.insteadOf && <Text>instead of {c.insteadOf}</Text>}
        {c.why && dim(`why: ${c.why}`)}
        {c.check && dim(`check it: ${c.check}`)}
        <Box gap={2} marginTop={1} flexWrap="wrap">
          <Button key="accept" plain hotkey="a" onPress={() => judge({ verdict: 'accept' })}>
            {j?.verdict === 'accept' ? <Text color="success" bold>Accept ✓</Text> : <Text color="success">Accept</Text>}
          </Button>
          <Button key="flag" plain hotkey="f" onPress={() => judge({ verdict: 'flag' })}>
            {j?.verdict === 'flag' ? <Text color="warning" bold>Flag it ✓</Text> : <Text color="warning">Flag it</Text>}
          </Button>
          {ownButton(c.id, 'Say what to do instead')}
        </Box>
        {ownField(c.id, 'What to do instead', text => judge({ verdict: 'own', own: text }))}
        {j?.verdict === 'own' && <Text color="success">◆ Instead: {j.own}</Text>}
      </Box>,
    )
  })
}
