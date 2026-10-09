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
    { index: 1, title: 'Hook', compositionId: '01-hook', narration: 'You asked for a small plan.' },
    { index: 2, title: 'Question 1', compositionId: '02-q1', narration: 'Question one. I recommend B.', decision: 'q1' },
    { index: 3, title: 'Question 2', compositionId: '03-q2', narration: 'Question two.', decision: 'q2' },
    { index: 4, title: 'The plan', compositionId: '04-plan' },
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
/** A Raster frame of `cols` × `rows` cells, every cell a half block in one color. */
function frame(cols: number, rows: number, rgb: number) {
  const words = new Uint32Array(cols * rows * 3)
  for (let i = 0; i < cols * rows; i++) words.set([0x2580, rgb, rgb], i * 3)
  return (new Uint8Array(words.buffer) as unknown as { toBase64(): string }).toBase64()
}

function world(on: On, opts: { cloud?: boolean; walkthrough?: boolean; surface?: 'terminal' | 'desktop' } = {}) {
  const files = new Map<string, string>([
    [`${PLAN}/video/plan-map.json`, JSON.stringify(planMap)],
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
  on('env.get', ($, e) => ({ value: e.name === 'CLAUDE_CODE_REMOTE' && opts.cloud ? 'true' : undefined }))
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
  on('fs.stat', ($, e) => {
    if (!files.has(e.path)) throw new Error(`ENOENT ${e.path}`)
    return { value: { mtimeMs: 1, size: 0, kind: 'file', isLink: false } } as never
  })
  on('prompt.submit', ($, e) => {
    prompts.push(e.text)
    return { text: e.text }
  })
  on('ui.toast', () => ({ value: undefined }))
  on('ui.open', () => ({ value: { isPlaced: true } }) as never)
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
      const cols = Number(arg('--cols')), rows = Number(arg('--rows'))
      const picture = arg('--as') === 'jpeg' ? '/9j/4AAQSkZJRg==' : frame(cols, rows, 0x3366cc)
      yield { stream: 'stdout' as const, text: `V 90 ${cols} ${rows}\nA none test\nF ${arg('--from')} ${picture}\n` }
      yield { stream: 'stdout' as const, text: `E ${arg('--to')}\n` }
    }
    return { value: { code: 0, signal: null } } as never
  } as never)
  on('ui.blit', ($, e) => {
    blits.push(e)
    return { value: {} }
  })
  return { files, prompts, spawned, blits }
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
  expect(await ui.find({ type: 'Button', text: /With sound/ })).toBeDefined()
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

test('the video plays in the pane, stops at the choice, and after the answer plays its branch and goes on', async ($, on) => {
  const { spawned, blits } = world(on)
  const ui = await $.ui.mount(pane('terminal'))
  await ui.press({ key: `open-${SLUG}` })
  expect(await ui.find({ type: 'Raster', key: 'screen' })).toBeDefined()
  await ui.press({ key: 'play' })
  const stretch = (a: string[]) => [a[a.indexOf('--from') + 1], a[a.indexOf('--to') + 1]]
  const plays = () => spawned.filter(a => !a.includes('--render'))
  expect(spawned[0]).toEqual(expect.arrayContaining(['reel-frames', `${PLAN}/video`, '--render']))
  expect(stretch(plays()[0] ?? [])).toEqual(['0', '20']) // from the start to choice 1
  expect(blits).toEqual([expect.objectContaining({ requestId: 'reelplanner', key: 'screen' })])
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
