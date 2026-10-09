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
      id: 'q1', kind: 'one', frameIndex: 2, planStep: 1, at: 20, question: 'Where does the cache live?',
      options: [
        { id: 'a', label: 'In memory', why: 'Fast, lost on restart.', recommended: false },
        { id: 'b', label: 'On disk', why: 'Survives a restart.', recommended: true },
      ],
    },
    {
      id: 'q2', kind: 'one', frameIndex: 3, planStep: 2, at: 50, question: 'Who clears it?',
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
function world(on: On, opts: { cloud?: boolean; walkthrough?: boolean } = {}) {
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
  return { files, prompts }
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
  await ui.press({ key: 'chip-send' })
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
    await ui.input({ key: 'own-q1', text: 'Neither: ask the host' })
    expect(await ui.find({ type: 'Text', text: /Who clears it\?/ })).toBeDefined()
    await ui.press({ key: 'chip-send' })
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
  expect(await ui.find({ type: 'Text', text: /Chose: a JSON file/ })).toBeDefined()
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
  expect(await ui.find({ type: 'Button', text: /Publish the player/ })).toBeDefined()
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
