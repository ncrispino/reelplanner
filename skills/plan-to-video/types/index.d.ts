/** Which of a plan's two videos: the plan video (before the build) or the walkthrough video (after it). */
export type ReelplannerWhich = 'video' | 'walkthrough-video'

/** The video the pane shows, and which of its stops; null shows the library. `dir` names a built video outside
 * `.reelplanner/plans/` (`/reel <video-dir>`). */
export type ReelplannerOpen = { slug: string; which: ReelplannerWhich; stop: number; dir?: string } | null

/** The video playing in the pane: its render being made, playing, paused, or stopped at a choice. */
export type ReelplannerPlayback = {
  key: string
  status: 'rendering' | 'playing' | 'paused' | 'ended' | 'failed'
  /** Where it is, in the video's seconds. */
  t: number
  /** Where this stretch stops: the next choice, or the end. */
  until: number
  mode: 'raster' | 'image' | 'jpeg'
  cols: number
  rows: number
  progress?: number
  audio?: string
  message?: string
}

/** One plan in the library, as its folder stands. */
export type ReelplannerPlan = {
  slug: string
  title: string
  /** The plan video's open choices, null when it has no video. */
  choices: number | null
  /** The walkthrough video's calls, null when it has none. */
  calls: number | null
  planReviewed: boolean
  walkthroughReviewed: boolean
}

/** An answer to a plan video's question, in the player's words (`option` an option id, `own`, `unclear` or `multi`). */
export type ReelplannerAnswer = { option: string; label: string; options?: string[]; labels?: string[]; at: string }

/** A verdict on a walkthrough video's call. */
export type ReelplannerVerdict = { verdict: 'accept' | 'flag' | 'own'; own?: string; at: string }

/** What became of the last Send for a video. */
export type ReelplannerSent = { at: string; path: string; how: 'waiter' | 'prompt' }

declare module 'claude-code' {
  interface PluginState {
    reelplanner: {
      open: ReelplannerOpen
      library: ReelplannerPlan[]
      /** Keyed `<slug>:<which>:<id>`. */
      answers: Record<string, ReelplannerAnswer>
      verdicts: Record<string, ReelplannerVerdict>
      /** Keyed `<slug>:<which>`: the reviewer's note to the agent. */
      notes: Record<string, string>
      /** Keyed `<slug>:<which>`: where the player is (localhost page, or a published Artifact). */
      links: Record<string, string>
      sent: Record<string, ReelplannerSent>
      /** A video the agent just opened for review, shown in the band above the prompt until dismissed. */
      ready: { slug: string; which: ReelplannerWhich } | null
      /** The video whose player Claude was asked to publish as an Artifact. */
      publishing: string | null
      busy: string | null
      playback: ReelplannerPlayback | null
      /** The last frame as an Svg, for a surface with no terminal to blit to. */
      flip: string | null
      /** The own-words field open in the pane (`<video>:<stop id>`, or `<video>:note`), null while none is. */
      composing: string | null
    }
  }
}
