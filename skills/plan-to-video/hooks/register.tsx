// reelplanner in Claude Code: a pane that plays a plan's video, stops at each open choice, takes the answer,
// plays the branch it picked and goes on, then files the answers the way the review player does.
//
// The picture is the video's own render (scripts/reel-frames.mjs makes it once, renders/terminal.mp4, and
// streams its frames): a Raster of half blocks in any truecolor terminal, a sharp Image in kitty or Ghostty,
// and a few frames a second as an Svg in the desktop and mobile apps. The sound plays on the machine the
// session runs on; the captions run under the picture, word for word.
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
type Frame = { index: number; title?: string; compositionId?: string; narration?: string; decision?: string | null }
type PlanMap = {
  project?: string
  title?: string
  planDir?: string
  totalSeconds?: number
  decisions?: Decision[]
  autonomy?: Call[]
  frames?: Frame[]
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
const screenSize = (bodyColumns: number) => {
  const cols = Math.max(24, Math.min(120, bodyColumns - 1))
  return { cols, rows: Math.max(6, Math.round((cols * 9) / 32)) }
}

const toBase64 = (bytes: Uint8Array) => (bytes as unknown as { toBase64(): string }).toBase64()

/** A dark screen, for before the first frame: every cell a space on near-black. */
function blank(cols: number, rows: number) {
  const words = new Uint32Array(cols * rows * 3)
  for (let i = 0; i < cols * rows; i++) {
    words[i * 3] = 0x20
    words[i * 3 + 1] = 0x01000000
    words[i * 3 + 2] = 0x111114
  }
  return toBase64(new Uint8Array(words.buffer))
}

const jpegSvg = (base64: string, width: number, height: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">` +
  `<image href="data:image/jpeg;base64,${base64}" width="${width}" height="${height}"/></svg>`

/** How this surface shows the picture. */
async function modeFor($: EngineInterface, surface: RenderSurface | null): Promise<ReelplannerPlayback['mode']> {
  if (surface !== 'terminal') return 'jpeg'
  if (imageRefused) return 'raster'
  const program = (await $.env.get('TERM_PROGRAM')) ?? ''
  const term = (await $.env.get('TERM')) ?? ''
  const kitty = (await $.env.get('KITTY_WINDOW_ID')) !== undefined
  return kitty || term === 'xterm-kitty' || /ghostty/i.test(program) ? 'image' : 'raster'
}

// The playback in flight: one at a time. Each play takes a new id; a loop whose id is no longer current stops.
let current = 0
let stream: AsyncGenerator<unknown, unknown> | null = null
let imageRefused = false
const frames = new Map<string, string>() // the last raster frame per video, so a redraw keeps the picture
let imageSize = { width: 0, height: 0 }
let paneColumns = 0 // the pane's width as last drawn

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
async function play($: EngineInterface, v: Video, stretches: { from: number; to: number }[], size: { cols: number; rows: number }): Promise<void> {
  try {
    await playing($, v, stretches, size)
  } catch (err) {
    // reel-frames could not start (an installed reelplanner from before it), or the stream broke
    await update($, playback, p =>
      p ? { ...p, status: 'failed' as const, message: `${String(err).slice(0, 200)} (is reelplanner up to date? it needs reel-frames)` } : p,
    )
  }
}

async function playing($: EngineInterface, v: Video, stretches: { from: number; to: number }[], size: { cols: number; rows: number }) {
  await stopPlayback($)
  const id = ++current
  const root = await $.session.root()
  const { argv } = await cli($, root)
  const mode = await modeFor($, await $.session.surface())
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
    if (mode === 'raster') args.push('--cols', String(size.cols), '--rows', String(size.rows))
    if (mode === 'image') args.push('--width', String(Math.min(1280, size.cols * 10)))
    if (mode === 'jpeg') args.push('--width', '384', '--fps', '3', '--no-audio')
    await update($, playback, p => (p ? { ...p, status: 'playing' as const, t: from, progress: undefined } : p))
    for await (const line of lines(args)) {
      const [kind, t, rest, gen] = line.split(' ')
      if (kind === 'V') imageSize = { width: Number(rest), height: Number(gen) }
      else if (kind === 'A') await update($, playback, p => (p ? { ...p, audio: line.slice(2) } : p))
      else if (kind === 'X') return failed(line.slice(2))
      else if (kind === 'F' || kind === 'I') {
        if (kind === 'F' && mode === 'raster' && rest) {
          frames.set(v.key, rest)
          void $.ui.blit({ requestId: PANE, key: 'screen', cells: rest })
        } else if (kind === 'F' && mode === 'jpeg' && rest) {
          await update($, flip, () => jpegSvg(rest, 384, 216))
        } else if (kind === 'I' && rest) {
          const res = await $.ui.blit({
            requestId: PANE,
            key: 'screen',
            source: { file: rest, format: 'rgb', width: imageSize.width, height: imageSize.height, generation: Number(gen) },
          })
          if (res.deny && /alt/.test(res.deny)) {
            // this terminal draws the Image's words, not its picture: the half blocks instead, from here
            imageRefused = true
            const now = Number(t)
            return play($, v, [{ from: now, to }, ...stretches.slice(stretches.findIndex(x => x.to === to) + 1)], size)
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
  await update($, playback, p => (p ? { ...p, status: 'ended' as const, t: until } : p))
}

/** Play up to stop `i` of the video open in the pane (the summary: to the end). */
async function playTo($: EngineInterface, v: Video, i: number, size: { cols: number; rows: number }, from?: number) {
  const map = await loadMap($, v.dir)
  if (!map) return
  const s = stretch(map, v.which, i)
  return play($, v, [{ from: from ?? s.from, to: s.to }], size)
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

  const record: ReelplannerSent = { at: row.submittedAt, path, how: waiting ? 'waiter' : 'prompt' }
  await update($, sent, s => ({ ...s, [v.key]: record }))
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
  const opened = await $.ui.open(asked ? { id: PANE, title: 'reelplanner', focus: true } : { id: PANE, title: 'reelplanner' })
  if (target && asked) {
    // it plays as it opens, sized to the pane once the pane has drawn (its width is known then)
    const root = await $.session.root()
    $.clock.after(250, () => {
      void read($, open).then(o => (o ? playTo($, videoOf(root, o), 0, screenSize(paneColumns || 80)) : undefined))
    })
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
    const size = mine ? { cols: mine.cols, rows: mine.rows } : screenSize(width)
    const using = Boolean(mine) // the video has been played here: moving between stops plays on
    const go = async (to: number, from?: number, branch?: Branch) => {
      const i = Math.max(0, Math.min(stops.length, to))
      await update($, open, o => (o ? { ...o, stop: i } : o))
      if (!using) return
      const s = stretch(map, v.which, i)
      const list = branch ? [{ from: branch.start, to: branch.end }, { from: from ?? s.from, to: s.to }] : [{ from: from ?? s.from, to: s.to }]
      void play($, v, list, size)
    }
    const done = (id: string) =>
      isPlanVideo(v.which) ? Boolean(allAnswers[`${v.key}:${id}`]) : Boolean(allVerdicts[`${v.key}:${id}`])
    const other: ReelplannerWhich = isPlanVideo(v.which) ? 'walkthrough-video' : 'video'
    const hasOther = v.inPlans && plan ? (isPlanVideo(v.which) ? plan.calls !== null : plan.choices !== null) : false

    // the screen: the video's own frames, with its clock and captions under it
    const playing = mine?.status === 'playing'
    const toggle = () => {
      if (playing) return stopPlayback($)
      const s = stretch(map, v.which, stop)
      const resumeAt = mine && mine.t > s.from && mine.t < s.to - 0.2 ? mine.t : s.from
      return play($, v, [{ from: resumeAt, to: s.to }], size)
    }
    let picture: RenderElement
    if (e.surface === 'terminal') {
      const t = $.ui.resolve(e)
      picture =
        mine?.mode === 'image' ? (
          <t.Image
            key="screen"
            source={{ rgba: 'AAAA/w==', width: 1, height: 1 }}
            columns={size.cols}
            rows={size.rows}
            alt={map.title ?? 'the video'}
          />
        ) : (
          <t.Raster key="screen" columns={size.cols} rows={size.rows} cells={frames.get(v.key) ?? blank(size.cols, size.rows)} />
        )
    } else {
      const svg = mine ? await read($, flip) : null
      picture =
        'Svg' in els && svg ? (
          <els.Svg source={svg} alt={map.title ?? 'the video'} width={Math.min(480, width * 8)} />
        ) : (
          <Text dimColor>▶ Press Play: the video plays here, a few frames a second (its sound: Watch with sound).</Text>
        )
    }
    const captions = await loadCaptions($, v.dir)
    const t = mine?.t ?? stretch(map, v.which, stop).from
    const caption = captions.find(c => c.start <= t + 0.05 && t < c.end)?.text
    const atStop = mine?.status === 'ended' && stop < stops.length
    const state = !mine
      ? 'Press p to play'
      : mine.status === 'rendering'
        ? `Making the video's render for the terminal (once)… ${mine.progress ?? 0}%`
        : mine.status === 'failed'
          ? `Could not play: ${mine.message ?? ''}`
          : mine.status === 'playing'
            ? `▶ playing to ${stop < stops.length ? `choice ${stop + 1}` : 'the end'}${mine.audio && !mine.audio.startsWith('none') ? ' · sound on' : ''}`
            : atStop
              ? `⏸ choice ${stop + 1}: answer below`
              : mine.status === 'ended'
                ? '■ the end'
                : '⏸ paused'
    const screen = (
      <Box flexDirection="column">
        {picture}
        <Text bold wrap="truncate-end">
          {caption ?? ' '}
        </Text>
        <Box gap={1} flexWrap="wrap">
          <Text dimColor>
            {clock(t)} / {clock(map.totalSeconds)} · {state}
          </Text>
          <Button key="play" hotkey="p" label={playing ? '‖ Pause' : '▶ Play'} onPress={() => toggle()} />
          <Button key="replay" hotkey="r" label="↺ Replay" onPress={() => playTo($, v, stop, size)} />
        </Box>
      </Box>
    )

    const header = (
      <Box flexDirection="column">
        <Text bold wrap="truncate-end">
          {map.title ?? v.slug}
        </Text>
        <Box gap={1} flexWrap="wrap">
          <Button key="library" hotkey="l" label="‹ All plans" onPress={() => stopPlayback($).then(() => update($, open, () => null))} />
          {hasOther && (
            <Button
              key="other"
              label={isPlanVideo(v.which) ? 'Walkthrough video' : 'Plan video'}
              onPress={() => openPane($, { slug: v.slug, which: other })}
            />
          )}
          {link ? (
            <Link href={link} label="Full player" />
          ) : (
            <Button
              key="watch"
              hotkey="w"
              label={cloud ? 'Watch with sound (Artifact)' : 'Full player (browser)'}
              onPress={() => openPlayer($, v)}
            />
          )}
        </Box>
        {working && <Text dimColor>{working}</Text>}
      </Box>
    )

    const chips = (
      <Box gap={1} flexWrap="wrap">
        <Text dimColor>{isPlanVideo(v.which) ? 'choices' : 'calls'}</Text>
        {stops.map((s, i) => (
          <Button key={`chip-${s.id}`} plain onPress={() => go(i)}>
            {i === stop ? <Text bold>[{i + 1}{done(s.id) ? '✓' : ''}]</Text> : <Text dimColor={done(s.id)}>{i + 1}{done(s.id) ? '✓' : ''}</Text>}
          </Button>
        ))}
        <Button key="chip-send" plain onPress={() => go(stops.length)}>
          {stop === stops.length ? <Text bold>[Send]</Text> : 'Send'}
        </Button>
      </Box>
    )

    if (stop >= stops.length) {
      const left = stops.filter(s => !done(s.id)).length
      const note = (await read($, notes))[v.key] ?? ''
      return (
        <Box flexDirection="column" gap={1}>
          {header}
          {screen}
          {chips}
          <Text bold>Your review</Text>
          <Box flexDirection="column">
            {stops.map((s, i) => {
              const a = isPlanVideo(v.which) ? allAnswers[`${v.key}:${s.id}`] : undefined
              const j = isPlanVideo(v.which) ? undefined : allVerdicts[`${v.key}:${s.id}`]
              const said = a ? a.label : j ? (j.verdict === 'own' ? `instead: ${j.own}` : j.verdict) : 'not answered'
              return (
                <Text key={`sum-${s.id}`} dimColor={!a && !j} wrap="truncate-end">
                  {i + 1}. {'question' in s ? s.question : s.chose} — {said}
                </Text>
              )
            })}
          </Box>
          {left > 0 && (
            <Text color="warning">
              {left} not answered: {isPlanVideo(v.which) ? 'they stay open questions' : 'they go on as the agent decided'}.
            </Text>
          )}
          {Input && (
            <Input
              key="note"
              label="Anything your agent should know first"
              value={note}
              onInput={value => update($, notes, n => ({ ...n, [v.key]: value }))}
              onSubmit={value => update($, notes, n => ({ ...n, [v.key]: value }))}
            />
          )}
          <Box gap={1} flexWrap="wrap">
            <Button key="approve" hotkey="a" label="Approve and send" variant="primary" onPress={() => send($, v, 'approve')} />
            <Button key="changes" hotkey="c" label="Send: changes needed" onPress={() => send($, v, 'changes')} />
          </Box>
          {terminal && <Text dimColor>keys: a approve and send · c send, changes needed · p play · l all plans · esc prompt</Text>}
          {lastSent && (
            <Text dimColor>
              Sent {lastSent.at.slice(0, 16).replace('T', ' ')} →{' '}
              {lastSent.how === 'waiter' ? 'the waiting session' : 'this session'} ({lastSent.path.replace(`${root}/`, '')})
            </Text>
          )}
        </Box>
      )
    }

    const s = stops[stop]
    if (!s) return header
    const keys =
      'question' in s
        ? `keys: p play/pause · 1–${Math.min(9, s.options.length)} choose · e explain more · n next · b back · r replay · w full player · esc prompt`
        : 'keys: p play/pause · a accept · f flag · n next · b back · r replay · w full player · esc prompt'
    const nav = (
      <Box gap={1}>
        <Button key="prev" hotkey="b" label="‹ Back" onPress={() => go(stop - 1)} />
        <Button key="next" hotkey="n" label={stop === stops.length - 1 ? 'To Send ›' : 'Next ›'} onPress={() => go(stop + 1)} />
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
      return (
        <Box flexDirection="column" gap={1}>
          {header}
          {screen}
          {chips}
          <Box flexDirection="column">
            <Text dimColor={!atStop} bold={atStop}>
              Choice {stop + 1} of {stops.length}
              {q.planStep ? ` · step ${q.planStep}` : ''} · at {clock(q.at)}
              {q.kind === 'multi' ? ' · pick any' : ''}
            </Text>
            <Text bold>{q.question}</Text>
            {q.questionMore && <Text dimColor>{q.questionMore}</Text>}
          </Box>
          <Box flexDirection="column">
            {q.options.map((o, i) => (
              <Box key={`o-${o.id}`} flexDirection="column">
                <Button
                  key={`opt-${o.id}`}
                  hotkey={i < 9 ? String(i + 1) : undefined}
                  variant={isChosen(o) ? 'primary' : undefined}
                  onPress={() => (q.kind === 'multi' ? toggleOption(o) : answer({ option: o.id, label: o.label }, o))}
                >
                  {terminal && i < 9 ? `${i + 1} ` : ''}
                  {o.id.toUpperCase()}. {o.label}
                  {o.recommended ? <Text dimColor> (recommended)</Text> : ''}
                  {isChosen(o) ? ' ✓' : ''}
                </Button>
                {o.why && <Text dimColor>{'     '}{o.why}</Text>}
              </Box>
            ))}
          </Box>
          <Box gap={1} flexWrap="wrap">
            <Button
              key="unclear"
              hotkey="e"
              variant={a?.option === 'unclear' ? 'primary' : undefined}
              label="Explain this more"
              onPress={() => answer({ option: 'unclear', label: 'Explain this more' })}
            />
          </Box>
          {Input && (
            <Input
              key={`own-${q.id}`}
              label="Or in your own words"
              placeholder="type, then Enter"
              value={a?.option === 'own' ? a.label : ''}
              onSubmit={value => (value.trim() ? answer({ option: 'own', label: value.trim() }) : undefined)}
            />
          )}
          {a && <Text color="success">Answer: {a.label}</Text>}
          {nav}
          {terminal && <Text dimColor>{keys}</Text>}
        </Box>
      )
    }

    const c = s
    const j = allVerdicts[`${v.key}:${c.id}`]
    const judge = async (next: Omit<ReelplannerVerdict, 'at'>) => {
      const at = new Date(await $.clock.now()).toISOString()
      await update($, verdicts, all => ({ ...all, [`${v.key}:${c.id}`]: { ...next, at } }))
      await go(stop + 1, c.at)
    }
    return (
      <Box flexDirection="column" gap={1}>
        {header}
        {screen}
        {chips}
        <Box flexDirection="column">
          <Text dimColor={!atStop} bold={atStop}>
            Call {stop + 1} of {stops.length} ({c.id.toUpperCase()}){c.planStep ? ` · step ${c.planStep}` : ''} · at {clock(c.at)}
          </Text>
          <Text bold>Chose: {c.chose}</Text>
          {c.insteadOf && <Text>Instead of: {c.insteadOf}</Text>}
          {c.why && <Text dimColor>Why: {c.why}</Text>}
          {c.check && <Text dimColor>Check: {c.check}</Text>}
        </Box>
        <Box gap={1} flexWrap="wrap">
          <Button key="accept" hotkey="a" label="Accept" variant={j?.verdict === 'accept' ? 'primary' : undefined} onPress={() => judge({ verdict: 'accept' })} />
          <Button key="flag" hotkey="f" label="Flag it" variant={j?.verdict === 'flag' ? 'primary' : undefined} onPress={() => judge({ verdict: 'flag' })} />
        </Box>
        {Input && (
          <Input
            key={`own-${c.id}`}
            label="Or say what to do instead"
            placeholder="type, then Enter"
            value={j?.verdict === 'own' ? (j.own ?? '') : ''}
            onSubmit={value => (value.trim() ? judge({ verdict: 'own', own: value.trim() }) : undefined)}
          />
        )}
        {j && <Text color="success">Verdict: {j.verdict === 'own' ? `instead: ${j.own}` : j.verdict}</Text>}
        {nav}
        {terminal && <Text dimColor>{keys}</Text>}
      </Box>
    )
  })
}
