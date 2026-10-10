import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const ROOT = '/repo'
const SLUG = '2026-10-01-small-plan'
const PLAN = `${ROOT}/.reelplanner/plans/${SLUG}`

const planMap = {
  project: 'video',
  title: 'A small plan',
  planDir: `.reelplanner/plans/${SLUG}`,
  totalSeconds: 90,
  frames: [
    { index: 1, title: 'Hook', compositionId: '01-hook', narration: 'You asked for a small plan.', start: 0 },
    { index: 2, title: 'Question 1', compositionId: '02-q1', narration: 'Question one. I recommend B.', decision: 'q1', start: 15 },
    { index: 3, title: 'Question 2', compositionId: '03-q2', narration: 'Question two.', decision: 'q2', start: 45 },
    { index: 4, title: 'The plan', compositionId: '04-plan', start: 80 },
  ],
  decisions: [
    {
      id: 'q1', kind: 'one', frameIndex: 2, planStep: 1, at: 20, resumeAt: 30, question: 'Where does the cache live?',
      options: [
        { id: 'a', label: 'In memory', why: 'Fast, lost on restart.', recommended: false, branch: { start: 20, end: 25 } },
        { id: 'b', label: 'On disk', why: 'Survives a restart.', recommended: true, branch: { start: 25, end: 30 } },
      ],
    },
    {
      id: 'q2', kind: 'one', frameIndex: 3, planStep: 2, at: 50, resumeAt: 55, question: 'Who clears it?',
      options: [
        { id: 'a', label: 'A timer', recommended: true },
        { id: 'b', label: 'The user', recommended: false },
      ],
    },
  ],
}

const walkMap = {
  project: 'walkthrough-video',
  title: 'A small plan',
  totalSeconds: 60,
  frames: [{ index: 1, title: 'Step 1', compositionId: '01-step', narration: 'Step one ran.' }],
  autonomy: [{ id: 'a1', frameIndex: 1, planStep: 1, chose: 'a JSON file', insteadOf: 'SQLite', why: 'one reader', at: 12 }],
}

/** A plan folder in memory, beneath the plugin: fs, the session's root, the env and the prompt. */
function world(
  on: On,
  opts: { cloud?: boolean; walkthrough?: boolean; surface?: 'terminal' | 'desktop'; kitty?: boolean; revised?: boolean } = {},
) {
  // a revision: only frame 3's scene changed since the last build
  const map = opts.revised
    ? { ...planMap, changes: { changedFrames: [3], changedSeconds: 35, totalSeconds: 90 },
        frames: planMap.frames.map((f, i) => ({ ...f, durationSeconds: [15, 30, 35, 10][i] })) }
    : planMap
  const files = new Map<string, string>([
    [`${PLAN}/video/plan-map.json`, JSON.stringify(map)],
    [`${PLAN}/plan.md`, '# A small plan'],
  ])
  if (opts.walkthrough) files.set(`${PLAN}/walkthrough-video/plan-map.json`, JSON.stringify(walkMap))
  const prompts: string[] = []
  const dirs = (path: string) => {
    const kids = new Map<string, 'file' | 'dir'>()
    for (const f of files.keys()) {
      if (!f.startsWith(`${path}/`)) continue
      const [head, ...rest] = f.slice(path.length + 1).split('/')
      if (head) kids.set(head, rest.length ? 'dir' : 'file')
    }
    return [...kids].map(([name, kind]) => ({ name, kind, size: 0, mtimeMs: 1, isLink: false }))
  }
  on('session.root', () => ({ value: ROOT }))
  let now = Date.parse('2026-10-09T12:00:00Z')
  on('clock.now', () => ({ value: (now += 1000) }))
  on('env.get', ($, e) => ({
    value: e.name === 'CLAUDE_CODE_REMOTE' && opts.cloud ? 'true' : e.name === 'KITTY_WINDOW_ID' && opts.kitty ? '1' : undefined,
  }))
  on('fs.read', ($, e) => {
    const text = files.get(e.path)
    if (text === undefined) throw new Error(`ENOENT ${e.path}`)
    return { value: text }
  })
  on('fs.write', ($, e) => {
    files.set(e.path, e.text)
    return { value: undefined }
  })
  on('fs.exists', ($, e) => ({ value: files.has(e.path) || dirs(e.path).length > 0 }))
  on('fs.list', ($, e) => {
    const list = dirs(e.path)
    if (!list.length) throw new Error(`ENOENT ${e.path}`)
    return { value: list }
  })
  // the video's plan map as last written: a rebuild writes it anew
  const built = { at: 1 }
  on('fs.stat', ($, e) => {
    if (!files.has(e.path)) throw new Error(`ENOENT ${e.path}`)
    return { value: { mtimeMs: e.path.endsWith('/video/plan-map.json') ? built.at : 1, size: 0, kind: 'file', isLink: false } } as never
  })
  on('prompt.submit', ($, e) => {
    prompts.push(e.text)
    return { text: e.text }
  })
  on('ui.toast', () => ({ value: undefined }))
  const opened: Record<string, unknown>[] = []
  on('ui.open', ($, e) => {
    opened.push({ ...e })
    return { value: { isPlaced: true } } as never
  })
  on('session.surface', () => ({ value: opts.surface ?? 'terminal' }) as never)
  on('clock.after', () => ({ deny: 'autoplay on open is left to the press in these tests' }))
  // reel-frames beneath: the render is there; a stretch is one frame, then its end
  const spawned: string[][] = []
  const blits: unknown[] = []
  on('process.spawn', async function* ($: unknown, e: { argv: readonly string[] }) {
    spawned.push([...e.argv])
    const arg = (n: string) => e.argv[e.argv.indexOf(n) + 1]
    if (e.argv.includes('--render')) yield { stream: 'stdout' as const, text: 'P 100\nR /repo/renders/terminal.mp4\n' }
    else {
      const line = arg('--as') === 'jpeg' ? `F ${arg('--from')} /9j/4AAQSkZJRg==` : `I ${arg('--from')} /repo/renders/frames/frame-0.rgb 0`
      yield { stream: 'stdout' as const, text: `V 90 640 360\nA none test\n${line}\n` }
      yield { stream: 'stdout' as const, text: `E ${arg('--to')}\n` }
    }
    return { value: { code: 0, signal: null } } as never
  } as never)
  on('ui.blit', ($, e) => {
    blits.push(e)
    return { value: {} }
  })
  // `reelplanner review --detach`, the browser player
  const ran: string[][] = []
  on('process.run', ($, e) => {
    ran.push([...e.argv])
    return { value: { exitCode: 0, stdout: '✓ review page: http://127.0.0.1:8787/\n', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
  })
  const rebuild = () => (built.at = Date.parse('2026-10-09T13:00:00Z')) // after every Send these tests make
  return { files, prompts, spawned, blits, ran, opened, rebuild }
}

const pane = <P extends 'terminal' | 'desktop' | 'mobile'>(surface: P) =>
  ({
    plugin: 'reelplanner',
    surface,
    component: 'Pane',
    requestId: 'reelplanner',
    props: { title: 'reelplanner', isFocused: true, bodyColumns: 80, placement: 'dock', scroll: { offset: 0 }, view: {} } as never,
  }) as const

const SURFACES = ['terminal', 'desktop', 'mobile'] as const

test('the library lists the plan, and a choice answered on any surface is filed as the player files it', async ($, on) => {
  const { files, prompts } = world(on)
  for (const surface of SURFACES) {
    const ui = await $.ui.mount(pane(surface))
    expect(await ui.find({ type: 'Button', text: /A small plan/ })).toBeDefined()
    await ui.press({ key: `open-${SLUG}` })
    expect(await ui.find({ type: 'Text', text: /Where does the cache live\?/ })).toBeDefined()
    expect(await ui.find({ type: 'Button', text: /On disk.*recommended/ })).toBeDefined()
    await ui.press({ key: 'opt-b' })
    expect(await ui.find({ type: 'Text', text: /Who clears it\?/ })).toBeDefined()
    await ui.press({ key: 'library' })
    await ui.unmount()
  }

  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  await ui.press({ key: 'next' })
  await ui.press({ key: 'next' })
  expect(await ui.find({ type: 'Text', text: /1 not answered/ })).toBeDefined()
  await ui.press({ key: 'approve' })

  const rows = [...files.keys()].filter(f => f.startsWith(`${ROOT}/.reelplanner/inbox/`))
  expect(rows).toHaveLength(1)
  const row = JSON.parse(files.get(rows[0] ?? '') ?? '{}')
  expect(row).toMatchObject({ status: 'submitted', planDir: `.reelplanner/plans/${SLUG}`, project: 'video', verdict: 'approve' })
  expect(row.review.decisions).toEqual([
    expect.objectContaining({ id: 'q1', option: 'b', label: 'On disk', recommended: true, planStep: 1, t: 20 }),
  ])
  expect(row.review.annotations).toEqual([expect.objectContaining({ kind: 'approve', t: 90 })])
  expect(prompts).toHaveLength(1)
  expect(prompts[0]).toContain('reel-intake')
  expect(prompts[0]).toContain(rows[0])
})

test('own words are an `own` answer with the note the player adds', async ($, on) => {
  const { files } = world(on)
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount(pane(surface))
    await ui.press({ key: `open-${SLUG}` })
    expect(await ui.find({ type: 'Input' })).toBeUndefined() // the field opens on asking
    await ui.press({ key: 'own' })
    await ui.input({ key: 'own-q1', text: 'Neither: ask the host' })
    expect(await ui.find({ type: 'Text', text: /Who clears it\?/ })).toBeDefined()
    await ui.press({ key: 'next' })
    await ui.press({ key: 'changes' })
    const row = JSON.parse(files.get([...files.keys()].filter(f => f.includes('/inbox/')).pop() ?? '') ?? '{}')
    expect(row.verdict).toBe('changes')
    expect(row.review.decisions[0]).toMatchObject({ id: 'q1', option: 'own', own: true, label: 'Neither: ask the host' })
    expect(row.review.annotations[0]).toMatchObject({ kind: 'note', comment: 'Neither: ask the host' })
    await ui.press({ key: 'library' })
    await ui.unmount()
  }
})

test("a walkthrough's calls are accepted or flagged", async ($, on) => {
  const { files } = world(on, { walkthrough: true })
  const ui = await $.ui.mount(pane('mobile'))
  await ui.press({ key: `open-${SLUG}` })
  expect(await ui.find({ type: 'Text', text: /a JSON file/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /instead of SQLite/ })).toBeDefined()
  await ui.press({ key: 'flag' })
  await ui.press({ key: 'approve' })
  const row = JSON.parse(files.get([...files.keys()].filter(f => f.includes('/inbox/')).pop() ?? '') ?? '{}')
  expect(row.project).toBe('walkthrough-video')
  expect(row.review.autonomy).toEqual([expect.objectContaining({ id: 'a1', verdict: 'flag', chose: 'a JSON file' })])
})

test('in a cloud session, Watch asks Claude to publish the player as an Artifact', async ($, on) => {
  const { prompts } = world(on, { cloud: true })
  const ui = await $.ui.mount(pane('mobile'))
  await ui.press({ key: `open-${SLUG}` })
  expect(await ui.find({ type: 'Button', text: /with sound/i })).toBeDefined()
  await ui.press({ key: 'watch' })
  expect(prompts[0]).toContain('Artifact')
  expect(prompts[0]).toContain(`${PLAN}/video`)
})

test('when the agent opens a video for review, the band above the prompt offers it here', async ($, on) => {
  world(on)
  // the engine's own band, drawn when the plugin passes (nothing waiting)
  on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text key="engine">nothing waiting</Text>
  })
  on('tool.call', () => ({ result: { stdout: '✓ review page: http://127.0.0.1:8787/', stderr: '', interrupted: false } }) as never)
  await $.tool.call({ tool: 'Bash', command: `node bin/reelplanner.mjs review .reelplanner/plans/${SLUG}/video --detach` } as never)
  for (const surface of SURFACES) {
    const band = await $.ui.mount({ plugin: 'reelplanner', surface, component: 'AbovePrompt', props: { hasSurvey: false } as never })
    expect(await band.find({ type: 'Text', text: /A small plan/ })).toBeDefined()
    expect(await band.find({ type: 'Button', key: 'review' })).toBeDefined()
    await band.unmount()
  }
  const band = await $.ui.mount({ plugin: 'reelplanner', surface: 'terminal', component: 'AbovePrompt', props: { hasSurvey: false } as never })
  await band.press({ key: 'review' })
  expect(await band.find({ type: 'Button', key: 'review' })).toBeUndefined()
  const ui = await $.ui.mount(pane('terminal'))
  expect(await ui.find({ type: 'Text', text: /Where does the cache live\?/ })).toBeDefined()
  expect(await ui.find({ type: 'Link' })).toMatchObject({ props: expect.objectContaining({ href: 'http://127.0.0.1:8787/' }) })
})

test('in a terminal without kitty graphics, the browser player opens, and the pane keeps the choices and says how to watch here', async ($, on) => {
  const { ran } = world(on)
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  expect(ran).toEqual([expect.arrayContaining(['review', '--detach', `${PLAN}/video`])])
  expect(await ui.find({ type: 'Text', text: /plays in your browser/ })).toBeDefined()
  expect(await ui.find({ type: 'Link', key: undefined })).toMatchObject({ props: expect.objectContaining({ href: 'http://127.0.0.1:8787/' }) })
  expect(await ui.find({ type: 'Text', text: /kitty or Ghostty/ })).toBeDefined()
  // no picture in the pane, and no coarse one offered: drawn in character cells the video cannot be read
  expect(await ui.find({ type: 'Image' })).toBeUndefined()
  expect(await ui.find({ type: 'Button', key: 'play' })).toBeUndefined()
  // the choices, the comments and Send stay in the pane
  expect(await ui.find({ type: 'Text', text: /Choice 1 of 2/ })).toBeDefined()
  expect(await ui.find({ type: 'Button', key: 'comment' })).toBeDefined()
  await ui.press({ key: 'library' })
})

test('comments left as it plays are kept by time and filed as notes at their moment', async ($, on) => {
  const { files } = world(on, { kitty: true })
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  await ui.press({ key: 'play' }) // plays to choice 1, at 0:20
  await ui.press({ key: 'comment' })
  await ui.input({ key: 'comment-field', text: 'the cache diagram is clear' })
  expect(await ui.find({ type: 'Text', text: /0:20 the cache diagram is clear/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /your review · 1 item/i })).toBeDefined()
  await ui.press({ key: 'opt-b' })
  await ui.press({ key: 'next' })
  await ui.press({ key: 'approve' })
  const row = JSON.parse(files.get([...files.keys()].filter(f => f.includes('/inbox/')).pop() ?? '') ?? '{}')
  expect(row.review.annotations).toEqual(
    expect.arrayContaining([expect.objectContaining({ kind: 'note', comment: 'the cache diagram is clear', t: 20, frame: expect.objectContaining({ index: 2 }) })]),
  )
  await ui.press({ key: 'library' })
})

test('the video plays in the pane, stops at the choice, and after the answer plays its branch and goes on', async ($, on) => {
  const { spawned, blits } = world(on, { kitty: true })
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  expect(await ui.find({ type: 'Image', key: 'screen' })).toBeDefined()
  await ui.press({ key: 'play' })
  const stretch = (a: string[]) => [a[a.indexOf('--from') + 1], a[a.indexOf('--to') + 1]]
  const plays = () => spawned.filter(a => !a.includes('--render'))
  expect(spawned[0]).toEqual(expect.arrayContaining(['reel-frames', `${PLAN}/video`, '--render']))
  expect(stretch(plays()[0] ?? [])).toEqual(['0', '20']) // from the start to choice 1
  expect(blits).toEqual([
    expect.objectContaining({ requestId: 'reelplanner', key: 'screen', source: expect.objectContaining({ file: '/repo/renders/frames/frame-0.rgb', format: 'rgb' }) }),
  ])
  expect(await ui.find({ type: 'Text', text: /0:20 \/ 1:30 · stopped at choice 1/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Choice 1 of 2/ })).toBeDefined() // the card, now the video is still

  await ui.press({ key: 'opt-b' })
  // B's branch, then on from where the question resumes to choice 2
  expect(plays().slice(1).map(stretch)).toEqual([['25', '30'], ['30', '50']])
  expect(await ui.find({ type: 'Text', text: /stopped at choice 2/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Who clears it\?/ })).toBeDefined()
  await ui.press({ key: 'library' })
})

test('on the desktop app the frames come as an Svg, a few a second, with no sound', async ($, on) => {
  const { spawned } = world(on, { surface: 'desktop' })
  const ui = await $.ui.mount(pane('desktop'))
  await ui.press({ key: `open-${SLUG}` })
  await ui.press({ key: 'play' })
  const args = spawned.find(a => !a.includes('--render')) ?? []
  expect(args).toEqual(expect.arrayContaining(['--as', 'jpeg', '--no-audio']))
  const svg = await ui.find({ type: 'Svg' })
  expect(String((svg?.props as { source?: string } | undefined)?.source)).toContain('data:image/jpeg;base64,/9j/')
  await ui.press({ key: 'library' })
})

test("an answer can carry a comment, filed as the decision's note (what reel record keeps as the reviewer's note)", async ($, on) => {
  const { files } = world(on, { kitty: true })
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  expect(await ui.find({ type: 'Text', text: /then c adds a comment/ })).toBeDefined() // said before an answer
  await ui.press({ key: 'opt-b' })
  await ui.press({ key: 'prev' }) // back to the choice just answered
  await ui.press({ key: 'answer-note' })
  await ui.input({ key: 'note-q1', text: 'but only if the disk is local' })
  expect(await ui.find({ type: 'Text', text: /Your comment: but only if the disk is local/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Choice 1 → On disk, “but only if the disk is local”/ })).toBeDefined()
  await ui.press({ key: 'next' })
  await ui.press({ key: 'next' })
  await ui.press({ key: 'approve' })
  const row = JSON.parse(files.get([...files.keys()].filter(f => f.includes('/inbox/')).pop() ?? '') ?? '{}')
  expect(row.review.decisions[0]).toMatchObject({ id: 'q1', option: 'b', label: 'On disk', note: 'but only if the disk is local' })
  await ui.press({ key: 'library' })
})

const stretchOf = (a: string[]) => [a[a.indexOf('--from') + 1], a[a.indexOf('--to') + 1]]

test('a revised video plays just what changed (and any scene with a question still open), or the whole video on v', async ($, on) => {
  const { spawned } = world(on, { kitty: true, revised: true })
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  expect(await ui.find({ type: 'Text', text: /Revised since the last build: 1 of 4 scenes changed/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Plays just the changes/ })).toBeDefined()
  await ui.press({ key: 'play' })
  const plays = () => spawned.filter(a => !a.includes('--render')).map(stretchOf)
  // to choice 1 (0:20): frame 1 did not change and holds no question, frame 2 holds q1, still open
  expect(plays()).toEqual([['15', '20']])
  await ui.press({ key: 'only' })
  expect(await ui.find({ type: 'Text', text: /Plays the whole video/ })).toBeDefined()
  await ui.press({ key: 'replay' })
  expect(plays()[1]).toEqual(['0', '20'])
  await ui.press({ key: 'library' })
})

test('Send says what each answer leads to, and after it the pane follows the review to the new version', async ($, on) => {
  const { rebuild } = world(on, { kitty: true })
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  await ui.press({ key: 'next' })
  await ui.press({ key: 'next' })
  expect(await ui.find({ type: 'Text', text: /folds your answers and comments into it and builds it\. No new plan video/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /rebuilds the scenes that change, and the new version comes back here/ })).toBeDefined()
  await ui.press({ key: 'changes' })
  expect(await ui.find({ type: 'Text', text: /Changes asked for · sent/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /the new version replaces this one when it is built/ })).toBeDefined()
  rebuild() // the agent rebuilt the video in its folder: coming back to it, the pane finds the new version
  await ui.press({ key: 'library' })
  await ui.press({ key: `open-${SLUG}` })
  await ui.press({ key: 'next' })
  await ui.press({ key: 'next' })
  expect(await ui.find({ type: 'Text', text: /The new version is ready/ })).toBeDefined()
  expect(await ui.find({ type: 'Button', key: 'watch-new' })).toBeDefined()
  await ui.press({ key: 'library' })
})

test('z makes the video bigger: the pane asks for most of the width and the review folds away', async ($, on) => {
  const { opened } = world(on, { kitty: true })
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  expect(await ui.find({ type: 'Text', text: /your review/i })).toBeDefined()
  await ui.press({ key: 'big' })
  expect(opened[opened.length - 1]).toMatchObject({ id: 'reelplanner', columns: expect.any(Number) })
  expect(await ui.find({ type: 'Text', text: /z shows it again/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Choice 1 of 2/ })).toBeDefined() // the choice stays
  await ui.press({ key: 'big' })
  expect(opened[opened.length - 1]).not.toHaveProperty('columns')
  await ui.press({ key: 'library' })
})

test('just the changes goes past choices already answered, and Back still reaches them', async ($, on) => {
  const { spawned } = world(on, { kitty: true, revised: true })
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  await ui.press({ key: 'opt-b' }) // q1 answered: on to q2
  expect(await ui.find({ type: 'Text', text: /Who clears it\?/ })).toBeDefined()
  await ui.press({ key: 'prev' }) // back to q1: shown, not skipped
  expect(await ui.find({ type: 'Text', text: /Where does the cache live\?/ })).toBeDefined()
  await ui.press({ key: 'play' }) // plays to q1 again...
  await ui.press({ key: 'next' }) // ...and on: q2 is still open, so it is the next stop
  expect(await ui.find({ type: 'Text', text: /stopped at choice 2|Who clears it\?/ })).toBeDefined()
  const last = spawned.filter(a => !a.includes('--render')).pop() ?? []
  // what plays on to q2 is just the changes: frame 3, which changed and holds q2, from 0:45 to its stop at 0:50
  expect(stretchOf(last)).toEqual(['45', '50'])
  await ui.press({ key: 'library' })
})
