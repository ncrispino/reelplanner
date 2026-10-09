// reelplanner in Claude Code: a pane that shows a plan's video stop by stop (each open choice with its
// narration, its still and its options) and files the answers the way the review player does.
//
// /reel lists the plans with a video; /reel <plan> opens one. When the agent opens a video for review
// (`reelplanner review …`), a band above the prompt offers it here too. Send writes the review row into
// .reelplanner/inbox/, where a waiting `review --wait` claims it; with nobody waiting, it asks this
// session to file it (reel-intake). Watching the video itself: the local player in a browser from a
// terminal, or, in a cloud session where localhost is out of reach, the player published as an Artifact.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement } from 'claude-code'

import type {
  ReelplannerAnswer,
  ReelplannerOpen,
  ReelplannerPlan,
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

// --- plan-map.json, the file the player reads (scripts/plan-map.mjs) -------------------------------

type Option = { id: string; label: string; why?: string; recommended?: boolean; more?: string }
type Decision = {
  id: string
  kind?: 'one' | 'multi'
  frameIndex?: number
  planStep?: number | null
  question: string
  questionMore?: string
  at?: number
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
  thumb?: string
  decision?: string | null
}
type PlanMap = {
  project?: string
  title?: string
  planDir?: string
  totalSeconds?: number
  decisions?: Decision[]
  autonomy?: Call[]
  frames?: Frame[]
}

const maps = new Map<string, { mtimeMs: number; map: PlanMap }>()
const posters = new Map<string, string | null>()

const plansDir = (root: string) => `${root}/.reelplanner/plans`
const videoDir = (root: string, slug: string, which: ReelplannerWhich) => `${plansDir(root)}/${slug}/${which}`
const keyOf = (slug: string, which: ReelplannerWhich) => `${slug}:${which}`
const isPlanVideo = (which: ReelplannerWhich) => which === 'video'

async function loadMap($: EngineInterface, root: string, slug: string, which: ReelplannerWhich) {
  const path = `${videoDir(root, slug, which)}/plan-map.json`
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

const stopsOf = (map: PlanMap, which: ReelplannerWhich): (Decision | Call)[] =>
  isPlanVideo(which) ? (map.decisions ?? []) : (map.autonomy ?? [])

function frameOf(map: PlanMap, stop: Decision | Call) {
  const frames = map.frames ?? []
  return (
    frames.find(f => f.decision === stop.id) ??
    frames.find(f => f.index === stop.frameIndex) ??
    null
  )
}

const count = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

const clock = (s?: number) =>
  s === undefined ? '' : `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

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
    const plan = await loadMap($, root, slug, 'video')
    const walk = await loadMap($, root, slug, 'walkthrough-video')
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

// --- the review row, as the player's Finish → Send builds it (packages/player, reviewRow) ------------

const randomId = () => Math.random().toString(36).slice(2, 15)

async function buildRow($: EngineInterface, slug: string, which: ReelplannerWhich, verdict: 'approve' | 'changes') {
  const root = await $.session.root()
  const map = await loadMap($, root, slug, which)
  if (!map) throw new Error(`no plan-map.json in ${videoDir(root, slug, which)}`)
  const now = new Date(await $.clock.now()).toISOString()
  const allAnswers = await read($, answers)
  const allVerdicts = await read($, verdicts)
  const note = (await read($, notes))[keyOf(slug, which)] ?? ''
  const frames = map.frames ?? []
  const frameRef = (f: Frame | null | undefined) =>
    f ? { compositionId: f.compositionId ?? '', index: f.index, title: f.title ?? '' } : null
  const annotations: unknown[] = []

  const decisions = isPlanVideo(which)
    ? (map.decisions ?? []).flatMap(q => {
        const a = allAnswers[`${keyOf(slug, which)}:${q.id}`]
        if (!a) return []
        const picked = q.options.find(o => o.id === a.option)
        if (a.option === 'own') {
          annotations.push({
            id: randomId(),
            kind: 'note',
            about: `Answered in their own words: ${q.question}`,
            comment: a.label,
            t: q.at ?? 0,
            frame: frameRef(frameOf(map, q)),
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

  const autonomy = isPlanVideo(which)
    ? []
    : (map.autonomy ?? []).flatMap(c => {
        const v = allVerdicts[`${keyOf(slug, which)}:${c.id}`]
        if (!v) return []
        return [
          {
            id: c.id,
            verdict: v.verdict,
            ...(v.own ? { own: v.own } : {}),
            t: c.at ?? 0,
            planStep: c.planStep ?? null,
            chose: c.chose,
            judgedAt: v.at,
          },
        ]
      })

  if (verdict === 'approve') {
    annotations.push({
      id: randomId(),
      kind: 'approve',
      comment: '',
      t: map.totalSeconds ?? 0,
      frame: frameRef(frames[frames.length - 1]),
      plan: { component: null, questions: [], step: null },
    })
  }

  const project = map.project ?? which
  const review = {
    version: 1,
    src: `${slug}/${which}/index.html`,
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
    planDir: `.reelplanner/plans/${slug}`,
    title: map.title ?? slug,
    verdict,
    note,
    review,
  }
}

/** `<project>-<submittedAt>`, as scripts/lib/inbox.mjs names a row. */
const rowId = (project: string, submittedAt: string) =>
  `${project}-${submittedAt.replace(/[-:]/g, '').replace(/\.\d+/, '')}`.replace(/[^A-Za-z0-9._-]+/g, '-')

async function send($: EngineInterface, slug: string, which: ReelplannerWhich, verdict: 'approve' | 'changes') {
  const root = await $.session.root()
  const row = await buildRow($, slug, which, verdict)
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
  await update($, sent, s => ({ ...s, [keyOf(slug, which)]: record }))
  if (waiting) {
    $.ui.toast('Review sent: the waiting session picks it up.')
    return
  }
  const { said } = await cli($, root)
  const kind = isPlanVideo(which) ? 'plan video' : 'walkthrough video'
  await $.prompt.submit({
    text:
      `I reviewed the ${kind} of "${row.title}" in the reel pane (verdict: ${verdict}). ` +
      `The review row is in the inbox: ${path}. Claim it (\`${said} review --wait --timeout 5\`), ` +
      `file it with \`${said} reel-intake <path>\`, act on it as the plan-to-video skill says for a review ` +
      `that comes back, and run \`${said} inbox done ${id}\`.`,
  })
  $.ui.toast('Review sent to Claude.')
}

// --- watching the video ---------------------------------------------------------------------------

async function openPlayer($: EngineInterface, slug: string, which: ReelplannerWhich) {
  const root = await $.session.root()
  const key = keyOf(slug, which)
  if (await isCloud($)) {
    // localhost in the container is out of the reviewer's reach: the player goes up as an Artifact.
    const { said } = await cli($, root)
    await update($, publishing, () => key)
    await $.prompt.submit({
      text:
        `Publish the reelplanner review player for ${videoDir(root, slug, which)} as a private Artifact so I ` +
        `can watch it from here: pack it with \`${said} bundle-player\` (see its --help; ` +
        `\`${said} reel rebuild\` first if its narration is missing), publish the bundle's page with its files ` +
        `and the \`db\` capability as docs/hosted-review.md describes, and give me the link.`,
    })
    return
  }
  await update($, busy, () => 'Opening the player…')
  try {
    const { argv } = await cli($, root)
    const ran = await $.process.run([...argv, 'review', '--detach', videoDir(root, slug, which)], {
      cwd: root,
      timeoutMs: 180_000,
    })
    const url = `${ran.stdout}\n${ran.stderr}`.match(/review page:\s*(\S+)/)?.[1]
    if (url) {
      await update($, links, l => ({ ...l, [key]: url }))
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

/** A still of the stop: the snapshot `reelplanner plan-map --thumbs` names, scaled down for a remote surface. */
async function posterSvg($: EngineInterface, png: string) {
  if (posters.has(png)) return posters.get(png) ?? null
  let svg: string | null = null
  try {
    const jpg = png.replace(/\.png$/, '.reel-480.jpg')
    if (!(await $.fs.exists(jpg))) {
      await $.process.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', png, '-vf', 'scale=480:-2', '-q:v', '8', jpg], {
        timeoutMs: 20_000,
      })
    }
    const { base64 } = await $.fs.read(jpg, { as: 'bytes' })
    if (base64.length < 120_000) {
      svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="480" height="270">` +
        `<image href="data:image/jpeg;base64,${base64}" width="480" height="270"/></svg>`
    }
  } catch {}
  posters.set(png, svg)
  return svg
}

async function openPane($: EngineInterface, target?: { slug: string; which?: ReelplannerWhich }, asked = true) {
  const plans = await scanLibrary($)
  await update($, library, () => plans)
  if (target) {
    const plan = plans.find(p => p.slug === target.slug)
    const which = target.which ?? (plan ? defaultWhich(plan) : 'video')
    await update($, open, () => ({ slug: target.slug, which, stop: 0 }))
  } else {
    await update($, open, () => null)
  }
  // asked (the command, a press): the pane takes the keys, so its hotkeys work at once; Esc gives them back
  return $.ui.open(asked ? { id: PANE, title: 'reelplanner', focus: true } : { id: PANE, title: 'reelplanner' })
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
      argumentHint: '[plan]',
    })
    return next(e)
  })

  on('command.run', { command: 'reel' }, async ($, e) => {
    const arg = e.args.trim()
    let target: { slug: string; which?: ReelplannerWhich } | undefined
    if (arg) {
      target = videoIn(arg) ?? undefined
      if (!target) {
        const plans = await scanLibrary($)
        const hit = plans.find(p => p.slug === arg) ?? plans.find(p => p.slug.includes(arg))
        if (!hit) return { text: `No plan with a video matches "${arg}". /reel lists them.` }
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
          if (url && !(await isCloud($))) await update($, links, l => ({ ...l, [keyOf(plan.slug, which)]: url }))
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
          label="Review here"
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
    const { Box, Text, Button, Link, Markdown } = els
    const Input = 'Input' in els ? els.Input : null
    const width = Math.max(30, e.props.bodyColumns)
    const root = await $.session.root()
    const shown = await read($, open)
    const working = await read($, busy)

    const plans = await scanLibrary($)
    if (!shown) {
      return (
        <Box flexDirection="column" gap={1}>
          <Text bold>Plans with a video</Text>
          {plans.length === 0 && (
            <Text dimColor>No plan here has a built video yet (.reelplanner/plans/*/video).</Text>
          )}
          {plans.slice(0, 30).map((p, i) => (
            <Box key={`plan-${p.slug}`} flexDirection="column">
              <Button key={`open-${p.slug}`} plain hotkey={i < 9 ? String(i + 1) : undefined} onPress={() => update($, open, () => ({ slug: p.slug, which: defaultWhich(p), stop: 0 }))}>
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

    const { slug, which, stop } = shown
    const key = keyOf(slug, which)
    const map = await loadMap($, root, slug, which)
    const plan = plans.find(p => p.slug === slug)
    if (!map) {
      return (
        <Box flexDirection="column">
          <Text>No built video at {videoDir(root, slug, which)}.</Text>
          <Button key="back" label="‹ All plans" onPress={() => update($, open, () => null)} />
        </Box>
      )
    }
    const stops = stopsOf(map, which)
    const allAnswers = await read($, answers)
    const allVerdicts = await read($, verdicts)
    const link = (await read($, links))[key]
    const lastSent = (await read($, sent))[key]
    const cloud = await isCloud($)
    const go = (to: number) => update($, open, o => (o ? { ...o, stop: Math.max(0, Math.min(stops.length, to)) } : o))
    const done = (id: string) =>
      isPlanVideo(which) ? Boolean(allAnswers[`${key}:${id}`]) : Boolean(allVerdicts[`${key}:${id}`])
    const other: ReelplannerWhich = isPlanVideo(which) ? 'walkthrough-video' : 'video'
    const hasOther = plan ? (isPlanVideo(which) ? plan.calls !== null : plan.choices !== null) : false

    const header = (
      <Box flexDirection="column">
        <Text bold>{map.title ?? slug}</Text>
        <Text dimColor>
          {isPlanVideo(which) ? 'Plan video' : 'Walkthrough video'} ·{' '}
          {isPlanVideo(which) ? count(stops.length, 'open choice') : count(stops.length, 'call the agent made', 'calls the agent made')} ·{' '}
          {clock(map.totalSeconds)}
        </Text>
        <Box gap={1} flexWrap="wrap">
          <Button key="library" hotkey="l" label="‹ All plans" onPress={() => update($, open, () => null)} />
          {hasOther && (
            <Button
              key="other"
              label={isPlanVideo(which) ? 'Walkthrough video' : 'Plan video'}
              onPress={() => update($, open, () => ({ slug, which: other, stop: 0 }))}
            />
          )}
          {link ? (
            <Link href={link} label="▶ Watch the video" />
          ) : (
            <Button
              key="watch"
              hotkey="w"
              label={cloud ? '▶ Publish the player to watch' : '▶ Open the player'}
              onPress={() => openPlayer($, slug, which)}
            />
          )}
        </Box>
        {working && <Text dimColor>{working}</Text>}
      </Box>
    )

    const chips = (
      <Box gap={1} flexWrap="wrap">
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
      const note = (await read($, notes))[key] ?? ''
      return (
        <Box flexDirection="column" gap={1}>
          {header}
          {chips}
          <Text bold>Your review</Text>
          <Box flexDirection="column">
            {stops.map((s, i) => {
              const a = isPlanVideo(which) ? allAnswers[`${key}:${s.id}`] : undefined
              const v = isPlanVideo(which) ? undefined : allVerdicts[`${key}:${s.id}`]
              const said = a ? a.label : v ? (v.verdict === 'own' ? `instead: ${v.own}` : v.verdict) : 'not answered'
              return (
                <Text key={`sum-${s.id}`} dimColor={!a && !v} wrap="truncate-end">
                  {i + 1}. {'question' in s ? s.question : s.chose} — {said}
                </Text>
              )
            })}
          </Box>
          {left > 0 && (
            <Text color="warning">
              {left} not answered: {isPlanVideo(which) ? 'they stay open questions' : 'they go on as the agent decided'}.
            </Text>
          )}
          {Input && (
            <Input
              key="note"
              label="Anything your agent should know first"
              value={note}
              onInput={value => update($, notes, n => ({ ...n, [key]: value }))}
              onSubmit={value => update($, notes, n => ({ ...n, [key]: value }))}
            />
          )}
          <Box gap={1} flexWrap="wrap">
            <Button key="approve" hotkey="a" label="Approve and send" variant="primary" onPress={() => send($, slug, which, 'approve')} />
            <Button key="changes" hotkey="c" label="Send: changes needed" onPress={() => send($, slug, which, 'changes')} />
          </Box>
          {e.surface === 'terminal' && <Text dimColor>keys: a approve and send · c send, changes needed · l all plans · esc prompt</Text>}
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
    const frame = frameOf(map, s)
    const thumb = frame?.thumb ? `${videoDir(root, slug, which)}/${frame.thumb}` : null
    const hasThumb = thumb ? await $.fs.exists(thumb) : false
    let still: RenderElement | null = null
    if (thumb && hasThumb) {
      if (e.surface === 'terminal') {
        const { Image } = $.ui.resolve(e)
        const columns = Math.min(64, width - 2)
        still = <Image source={{ file: thumb, format: 'png' }} columns={columns} rows={Math.round(columns * 0.28)} alt={frame?.title ?? ' '} />
      } else if ('Svg' in els) {
        const svg = await posterSvg($, thumb)
        if (svg) still = <els.Svg source={svg} alt={frame?.title ?? 'the stop in the video'} width={Math.min(480, width * 8)} />
      }
    }
    const narration = frame?.narration ? (
      <Markdown dimColor text={`> ${frame.narration.replace(/\n+/g, ' ')}`} />
    ) : null
    const keys =
      'question' in s
        ? `keys: 1–${Math.min(9, s.options.length)} choose · e explain more · n next · b back · w watch · l all plans · esc prompt`
        : 'keys: a accept · f flag · n next · b back · w watch · l all plans · esc prompt'
    const nav = (
      <Box gap={1}>
        <Button key="prev" hotkey="b" label="‹ Back" onPress={() => go(stop - 1)} />
        <Button key="next" hotkey="n" label={stop === stops.length - 1 ? 'To Send ›' : 'Next ›'} onPress={() => go(stop + 1)} />
        {e.surface === 'terminal' && frame?.narration && (
          <Button
            key="speak"
            label="Read aloud"
            onPress={() => $.audio.speak(frame.narration ?? '').catch(() => $.ui.toast('No speech synthesizer here.'))}
          />
        )}
      </Box>
    )

    if ('question' in s) {
      const q = s
      const a = allAnswers[`${key}:${q.id}`]
      const answer = async (next: Omit<ReelplannerAnswer, 'at'>, advance = true) => {
        const at = new Date(await $.clock.now()).toISOString()
        await update($, answers, all => ({ ...all, [`${key}:${q.id}`]: { ...next, at } }))
        if (advance) await go(stop + 1)
      }
      const toggle = (o: Option) => {
        const ids = new Set(a?.option === 'multi' ? a.options : [])
        if (ids.has(o.id)) ids.delete(o.id)
        else ids.add(o.id)
        const chosen = q.options.filter(x => ids.has(x.id))
        return answer(
          { option: 'multi', options: chosen.map(x => x.id), labels: chosen.map(x => x.label), label: chosen.map(x => x.label).join(' + ') },
          false,
        )
      }
      const isChosen = (o: Option) => (a?.option === 'multi' ? (a.options ?? []).includes(o.id) : a?.option === o.id)
      return (
        <Box flexDirection="column" gap={1}>
          {header}
          {chips}
          <Box flexDirection="column">
            <Text dimColor>
              Choice {stop + 1} of {stops.length}
              {q.planStep ? ` · step ${q.planStep}` : ''} · at {clock(q.at)}
              {q.kind === 'multi' ? ' · pick any' : ''}
            </Text>
            <Text bold>{q.question}</Text>
            {q.questionMore && <Text dimColor>{q.questionMore}</Text>}
          </Box>
          {still}
          {narration}
          <Box flexDirection="column">
            {q.options.map((o, i) => (
              <Box key={`o-${o.id}`} flexDirection="column">
                <Button
                  key={`opt-${o.id}`}
                  hotkey={i < 9 ? String(i + 1) : undefined}
                  variant={isChosen(o) ? 'primary' : undefined}
                  onPress={() => (q.kind === 'multi' ? toggle(o) : answer({ option: o.id, label: o.label }))}
                >
                  {o.id.toUpperCase()}. {o.label}
                  {o.recommended ? <Text dimColor> (recommended)</Text> : ''}
                  {isChosen(o) ? ' ✓' : ''}
                </Button>
                {o.why && <Text dimColor>{'   '}{o.why}</Text>}
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
              value={a?.option === 'own' ? a.label : ''}
              onSubmit={value => (value.trim() ? answer({ option: 'own', label: value.trim() }) : undefined)}
            />
          )}
          {a && <Text color="success">Answer: {a.label}</Text>}
          {nav}
          {e.surface === 'terminal' && <Text dimColor>{keys}</Text>}
        </Box>
      )
    }

    const c = s
    const v = allVerdicts[`${key}:${c.id}`]
    const judge = async (next: Omit<ReelplannerVerdict, 'at'>) => {
      const at = new Date(await $.clock.now()).toISOString()
      await update($, verdicts, all => ({ ...all, [`${key}:${c.id}`]: { ...next, at } }))
      await go(stop + 1)
    }
    return (
      <Box flexDirection="column" gap={1}>
        {header}
        {chips}
        <Box flexDirection="column">
          <Text dimColor>
            Call {stop + 1} of {stops.length} ({c.id.toUpperCase()}){c.planStep ? ` · step ${c.planStep}` : ''} · at {clock(c.at)}
          </Text>
          <Text bold>Chose: {c.chose}</Text>
          {c.insteadOf && <Text>Instead of: {c.insteadOf}</Text>}
          {c.why && <Text dimColor>Why: {c.why}</Text>}
          {c.check && <Text dimColor>Check: {c.check}</Text>}
        </Box>
        {still}
        {narration}
        <Box gap={1} flexWrap="wrap">
          <Button key="accept" hotkey="a" label="Accept" variant={v?.verdict === 'accept' ? 'primary' : undefined} onPress={() => judge({ verdict: 'accept' })} />
          <Button key="flag" hotkey="f" label="Flag it" variant={v?.verdict === 'flag' ? 'primary' : undefined} onPress={() => judge({ verdict: 'flag' })} />
        </Box>
        {Input && (
          <Input
            key={`own-${c.id}`}
            label="Or say what to do instead"
            value={v?.verdict === 'own' ? (v.own ?? '') : ''}
            onSubmit={value => (value.trim() ? judge({ verdict: 'own', own: value.trim() }) : undefined)}
          />
        )}
        {v && <Text color="success">Verdict: {v.verdict === 'own' ? `instead: ${v.own}` : v.verdict}</Text>}
        {nav}
        {e.surface === 'terminal' && <Text dimColor>{keys}</Text>}
      </Box>
    )
  })
}
