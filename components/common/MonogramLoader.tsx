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

const facet =
  "animate-monogram-assemble will-change-transform [transform-box:fill-box] origin-center motion-reduce:animate-none"

export function MonogramLoader({
  className,
  label = "Loading Supply Intelligence",
  speed = 1,
}: MonogramLoaderProps) {
  const uid = useId().replace(/:/g, "")
  const fill = (name: string) => `url(#${uid}-${name})`
  const style = { "--monogram-speed": 1 / speed } as CSSProperties

  return (
    <div
      role="img"
      aria-label={label}
      style={style}
      className="flex flex-col items-center"
    >
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
            <polygon points="18,58 136,126 136,164 18,96" fill={fill("deep")} />
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

      {/* Progress track */}
      <div className="mt-9 h-[3px] w-28 overflow-hidden rounded-full bg-slate-200/80">
        <div className="h-full w-full origin-left animate-monogram-progress rounded-full bg-linear-to-r from-monogram-blue to-monogram-cyan motion-reduce:animate-none" />
      </div>
    </div>
  )
}
