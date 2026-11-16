import { useId, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

interface MonogramLoaderProps {
  className?: string
  label?: string
  /** Playback speed: 1 = base timing, 0.8 = 25% slower. */
  speed?: number
}

type Tone = "navy" | "blue" | "cyan"

const stopTone: Record<Tone, string> = {
  navy: "[stop-color:var(--color-monogram-navy)]",
  blue: "[stop-color:var(--color-monogram-blue)]",
  cyan: "[stop-color:var(--color-monogram-cyan)]",
}

interface GradientDef {
  id: string
  from: Tone
  to: Tone
  x1: string
  y1: string
  x2: string
  y2: string
}

const gradients: GradientDef[] = [
  {
    id: "deep",
    from: "blue",
    to: "navy",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%",
  },
  {
    id: "cyan",
    from: "blue",
    to: "cyan",
    x1: "0%",
    y1: "100%",
    x2: "100%",
    y2: "0%",
  },
  {
    id: "turn",
    from: "blue",
    to: "navy",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  },
  {
    id: "cubeLeft",
    from: "navy",
    to: "blue",
    x1: "100%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  },
  {
    id: "cubeRight",
    from: "navy",
    to: "blue",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%",
  },
]

// Wordmark outlines from the brand logo file ("SUPPLY" and "INTELLIGENCE").
const supplyPaths: string[] = [
  "M0,191.749l4.08-4.733c4.08,3.998,9.628,6.61,15.666,6.61,7.344,0,11.587-3.509,11.587-8.404,0-5.712-4.161-7.344-9.547-9.628l-7.752-3.427c-5.304-2.122-11.505-5.874-11.505-13.789,0-8.16,7.344-14.198,17.544-14.198,6.69,0,12.566,2.693,16.482,6.61l-3.591,4.406c-3.508-3.101-7.589-4.978-13.136-4.978-6.201,0-10.362,2.938-10.362,7.752,0,5.14,4.977,7.017,9.547,8.813l7.506,3.345c6.61,2.612,11.832,6.365,11.832,14.28,0,8.486-7.18,15.258-18.93,15.258-7.833,0-14.605-3.101-19.419-7.914Z",
  "M49.935,178.449v-33.291h6.935v33.454c0,11.016,4.815,15.014,11.178,15.014,6.446,0,11.343-3.998,11.343-15.014v-33.454h6.609v33.291c0,15.341-7.507,21.215-17.951,21.215-10.525,0-18.113-5.874-18.113-21.215Z",
  "M100.768,145.158h16.156c11.831,0,19.828,3.998,19.828,15.748,0,11.342-8.079,16.564-19.828,16.564h-9.303v21.215h-6.854v-53.527ZM116.108,171.922c9.302,0,13.79-3.427,13.79-11.016,0-7.669-4.569-10.199-13.79-10.199h-8.486v21.215h8.486Z",
  "M149.725,145.158h16.156c11.831,0,19.828,3.998,19.828,15.748,0,11.342-8.079,16.564-19.828,16.564h-9.303v21.215h-6.854v-53.527ZM165.065,171.922c9.302,0,13.79-3.427,13.79-11.016,0-7.669-4.569-10.199-13.79-10.199h-8.486v21.215h8.486Z",
  "M201.292,145.158h6.772v47.734h26.437v5.793h-33.209v-53.527Z",
  "M260.366,179.591l-17.951-34.433h7.262l7.996,15.83c2.04,4.161,3.917,8.241,6.12,12.484h.326c2.122-4.243,4.243-8.323,6.283-12.484l7.752-15.83h7.017l-17.951,34.433v19.094h-6.854v-19.094Z",
]

const intelligencePaths: string[] = [
  "M2.608,211.285v19.131H.653v-19.131h1.955Z",
  "M17.007,230.415v-19.131h2.715c2.873,4.538,9.405,14.695,10.549,16.773h.032c-.173-2.622-.15-5.528-.15-8.648v-8.125h1.907v19.131h-2.534c-2.7-4.304-9.408-15.026-10.699-17.149h-.032c.137,2.362.123,5.355.123,8.818v8.331h-1.912Z",
  "M52.451,213.015h-6.312v-1.73h14.621v1.73h-6.331v17.4h-1.978v-17.4Z",
  "M86.417,221.221h-9.647v7.464h10.579l-.268,1.73h-12.244v-19.131h12.056v1.73h-10.123v6.476h9.647v1.73Z",
  "M99.564,211.285h1.955v17.4h10.142l-.309,1.73h-11.787v-19.131Z",
  "M124.292,211.285h1.955v17.4h10.142l-.309,1.73h-11.787v-19.131Z",
  "M150.974,211.285v19.131h-1.955v-19.131h1.955Z",
  "M179.815,230.415h-1.554c-.118-.285-.182-1.21-.214-2.85-.751,1.333-2.32,3.086-6.07,3.086-5.504,0-8.371-4.184-8.371-9.624,0-5.719,3.067-10.017,8.747-10.017,4.27,0,7.033,2.271,7.609,5.748h-1.955c-.743-2.449-2.472-4.044-5.709-4.044-4.629,0-6.624,3.639-6.624,8.213,0,4.178,1.957,8.011,6.471,8.011,4.559,0,5.774-2.996,5.774-6.778v-.21h-5.82v-1.731h7.715v10.196Z",
  "M206.906,221.221h-9.647v7.464h10.579l-.268,1.73h-12.244v-19.131h12.055v1.73h-10.123v6.476h9.647v1.73Z",
  "M220.358,230.415v-19.131h2.716c2.872,4.538,9.404,14.695,10.549,16.773h.032c-.174-2.622-.15-5.528-.15-8.648v-8.125h1.907v19.131h-2.533c-2.701-4.304-9.409-15.026-10.7-17.149h-.031c.137,2.362.123,5.355.123,8.818v8.331h-1.912Z",
  "M261.959,225.163c-.878,3.13-3.2,5.48-7.379,5.48-5.597,0-8.488-4.359-8.488-9.753,0-5.18,2.863-9.88,8.546-9.88,4.301,0,6.74,2.42,7.34,5.618h-1.955c-.789-2.306-2.296-3.914-5.476-3.914-4.514,0-6.387,4.115-6.387,8.126,0,3.943,1.819,8.098,6.496,8.098,3.041,0,4.494-1.647,5.344-3.775h1.959Z",
  "M284.239,221.221h-9.647v7.464h10.579l-.268,1.73h-12.244v-19.131h12.056v1.73h-10.123v6.476h9.647v1.73Z",
]

const facet =
  "animate-monogram-assemble will-change-transform [transform-box:fill-box] origin-center motion-reduce:animate-none"

const reveal =
  "animate-monogram-reveal will-change-transform motion-reduce:animate-none"

/**
 * Monogram assembles, then the "Supply Intelligence" wordmark fades in.
 * The progress bar is pinned to the bottom of the nearest positioned ancestor,
 * so render this inside a fixed or relative container.
 */
export function MonogramLoader({
  className,
  label = "Loading Supply Intelligence",
  speed = 1,
}: MonogramLoaderProps) {
  const uid = useId().replace(/:/g, "")
  const fill = (name: string) => `url(#${uid}-${name})`
  const style = { "--monogram-speed": 1 / speed } as CSSProperties

  return (
    <div role="img" aria-label={label} style={style} className="contents">
      <div className="flex flex-col items-center">
        <div className="animate-monogram-float will-change-transform motion-reduce:animate-none">
          <svg
            viewBox="0 0 200 226"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={cn("h-32 w-28 sm:h-36 sm:w-32", className)}
          >
            <defs>
              {gradients.map(({ id, from, to, ...coords }) => (
                <linearGradient key={id} id={`${uid}-${id}`} {...coords}>
                  <stop offset="0%" className={stopTone[from]} />
                  <stop offset="100%" className={stopTone[to]} />
                </linearGradient>
              ))}
            </defs>

            {/* 1. Top inner cube facets */}
            <g
              className={cn(
                facet,
                "[--from-scale:0.84] [--from-y:-28px] [--monogram-delay:0.1s]"
              )}
            >
              <polygon
                points="100,10 64,31 64,73 100,52"
                fill={fill("cubeLeft")}
              />
              <polygon
                points="100,10 136,31 136,73 100,52"
                fill={fill("cubeRight")}
              />
              <polygon
                points="100,52 136,73 100,94 64,73"
                className="fill-monogram-cyan"
              />
            </g>

            {/* 2a. Top-left corner triangle */}
            <g
              className={cn(
                facet,
                "[--from-scale:0.86] [--from-x:-24px] [--from-y:-14px] [--monogram-delay:0.32s]"
              )}
            >
              <polygon points="54,37 18,58 54,79" fill={fill("deep")} />
            </g>

            {/* 2b. Top-right corner triangle */}
            <g
              className={cn(
                facet,
                "[--from-scale:0.86] [--from-x:24px] [--from-y:-14px] [--monogram-delay:0.42s]"
              )}
            >
              <polygon points="146,37 182,58 146,79" fill={fill("deep")} />
            </g>

            {/* 3. Center diagonal ribbon */}
            <g
              className={cn(
                facet,
                "[--from-scale:0.9] [--from-x:-26px] [--from-y:-16px] [--monogram-delay:0.56s]"
              )}
            >
              <polygon
                points="18,58 136,126 136,164 18,96"
                fill={fill("deep")}
              />
            </g>

            {/* 4. Bottom base and vertical turn */}
            <g
              className={cn(
                facet,
                "[--from-scale:0.88] [--from-y:28px] [--monogram-delay:0.78s]"
              )}
            >
              <polygon
                points="18,114 100,161 100,216 18,169"
                fill={fill("cyan")}
              />
              <polygon
                points="100,161 136,140 136,195 100,216"
                fill={fill("turn")}
              />
            </g>

            {/* 5. Right isometric pillar */}
            <g
              className={cn(
                facet,
                "[--from-scale:0.88] [--from-x:26px] [--from-y:18px] [--monogram-delay:1s]"
              )}
            >
              <polygon
                points="113,101 182,61 182,169 146,190 146,120"
                fill={fill("cyan")}
              />
            </g>
          </svg>
        </div>

        {/* Wordmark: appears slowly once the monogram is complete */}
        <svg
          viewBox="0 140 285.17 91"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="mt-6 h-auto w-64 sm:w-72"
        >
          <defs>
            <linearGradient
              id={`${uid}-word`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="285"
              y2="0"
            >
              <stop offset="0%" className={stopTone.blue} />
              <stop offset="59%" className={stopTone.cyan} />
              <stop offset="100%" className={stopTone.blue} />
            </linearGradient>
          </defs>
          <g
            fill={fill("word")}
            className={cn(reveal, "[--from-y:14px] [--monogram-delay:2.4s]")}
          >
            {supplyPaths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g
            fill={fill("word")}
            className={cn(reveal, "[--from-y:10px] [--monogram-delay:3s]")}
          >
            {intelligencePaths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      </div>

      {/* Progress track, pinned to the bottom */}
      <div className="absolute inset-x-0 bottom-12 flex justify-center">
        <div className="h-[3px] w-40 overflow-hidden rounded-full bg-slate-200/80 sm:w-56">
          <div className="h-full w-full origin-left animate-monogram-progress rounded-full bg-linear-to-r from-monogram-blue to-monogram-cyan motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  )
}
