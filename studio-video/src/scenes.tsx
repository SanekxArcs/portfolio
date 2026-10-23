import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandModel } from "./BrandModel";
import { Arrow, Browser, Frame, Grid, Title } from "./elements";
import { clamp, color, ease, enter } from "./design";
import { useFilmCopy } from "./i18n";

const useFormat = () => {
  const { width, height } = useVideoConfig();
  return { portrait: height > width, width, height };
};

export const Opening = () => {
  const copy = useFilmCopy();
  const f = useCurrentFrame();
  const { portrait } = useFormat();
  const flip = f >= 77;
  const swap = interpolate(f, [77, 96], [0, 1], { ...clamp, easing: ease });
  return (
    <Frame number="01" label={copy.opening.label}>
      <Grid />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          background: "radial-gradient(ellipse,#00b87a22,transparent 68%)",
          right: portrait ? -180 : -10,
          top: portrait ? 450 : 0,
        }}
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: portrait ? "column" : "row",
          gap: portrait ? 18 : 0,
        }}
      >
        <div
          style={{
            width: portrait ? "100%" : "58%",
            zIndex: 2,
            flexShrink: 0,
            paddingTop: portrait ? 80 : 0,
          }}
        >
          <Title lines={[copy.opening.lead]} size={portrait ? 142 : 174} />
          <div
            style={{
              height: portrait ? 190 : 210,
              position: "relative",
              fontSize: portrait ? 142 : 174,
              fontWeight: 750,
              letterSpacing: "-.065em",
              lineHeight: 1.06,
              color: color.mint,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                translate: `0 ${flip ? -swap * 115 : interpolate(f, [14, 42], [115, 0], { ...clamp, easing: ease })}%`,
                position: "absolute",
                inset: 0,
              }}
            >
              {copy.opening.first}
            </div>
            {flip && (
              <div
                style={{
                  translate: `0 ${(1 - swap) * 115}%`,
                  position: "absolute",
                  inset: 0,
                }}
              >
                {copy.opening.second}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: portrait ? 38 : 35,
              color: color.muted,
              marginTop: portrait ? 20 : 34,
              opacity: enter(f, 43),
              translate: `0 ${(1 - enter(f, 43)) * 16}px`,
            }}
          >
            {copy.opening.support}
          </div>
        </div>
        <div
          style={{
            width: portrait ? 830 : 770,
            height: portrait ? 850 : 770,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginLeft: portrait ? 0 : -35,
            marginTop: portrait ? -12 : 0,
          }}
        >
          <BrandModel size={portrait ? 830 : 770} />
        </div>
      </div>
    </Frame>
  );
};

export const Websites = () => {
  const copy = useFilmCopy();
  const f = useCurrentFrame();
  const { portrait } = useFormat();
  const move = enter(f, 17, 43);
  const swap = enter(f, 87, 26);
  return (
    <Frame theme="paper" number="02" label={copy.websites.label}>
      <div style={{ paddingTop: portrait ? 85 : 45, flexShrink: 0 }}>
        <Title
          lines={portrait ? copy.websites.portrait : copy.websites.wide}
          size={portrait ? 118 : 130}
        />
      </div>
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1800,
          minHeight: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            translate: `${(1 - move) * 150}px ${(1 - move) * 150}px`,
            rotate: `${interpolate(f, [17, 70, 165], [-7, -3, 0], { ...clamp, easing: ease })}deg`,
            transform: `rotateY(${(1 - move) * -16}deg) rotateX(${3 - Math.sin(f / 80) * 2}deg)`,
            opacity: move,
          }}
        >
          <div
            style={{
              position: "relative",
              width: portrait ? 865 : 1220,
              height: portrait ? 690 : 605,
              translate: `0 ${Math.sin(f / 70) * 9}px`,
            }}
          >
            <Browser
              project="solar-sense"
              url="solarsense.o-d.dev"
              width={portrait ? 865 : 1220}
              height={portrait ? 690 : 605}
              style={{
                position: "absolute",
                opacity: 1 - swap,
                translate: `${-swap * 120}px 0`,
                scale: 1 - swap * 0.03,
              }}
            />
            <Browser
              project="feigin-electric"
              url="feiginelectric.o-d.dev"
              width={portrait ? 865 : 1220}
              height={portrait ? 690 : 605}
              style={{
                position: "absolute",
                opacity: swap,
                translate: `${(1 - swap) * 170}px 0`,
                scale: 0.97 + swap * 0.03,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              right: portrait ? -25 : -130,
              bottom: portrait ? -160 : -30,
              width: portrait ? 225 : 200,
              height: portrait ? 450 : 385,
              border: "9px solid #15251c",
              borderRadius: 36,
              overflow: "hidden",
              boxShadow: "0 24px 55px #001f2b40",
              rotate: "7deg",
              scale: enter(f, 47, 28),
            }}
          >
            <Img
              src={staticFile("projects/solar-sense-mobile.webp")}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                opacity: 1 - swap,
              }}
            />
            <Img
              src={staticFile("projects/feigin-electric-mobile.webp")}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                opacity: swap,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 5,
                left: "35%",
                width: "30%",
                height: 10,
                background: color.ink,
                borderRadius: 10,
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          paddingBottom: portrait ? 75 : 10,
          fontSize: portrait ? 35 : 32,
          color: "#385346",
          opacity: enter(f, 45),
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: color.green,
          }}
        />
        {copy.websites.support}
      </div>
    </Frame>
  );
};

export const Applications = () => {
  const copy = useFilmCopy();
  const f = useCurrentFrame();
  const { portrait } = useFormat();
  const swap = enter(f, 79, 26);
  return (
    <Frame number="03" label={copy.applications.label}>
      <Grid />
      <div style={{ paddingTop: portrait ? 80 : 38, zIndex: 2 }}>
        <Title
          lines={portrait ? copy.applications.portrait : copy.applications.wide}
          size={portrait ? 118 : 130}
          accent={portrait ? 1 : undefined}
        />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          perspective: 2000,
          minHeight: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            opacity: 1 - swap,
            translate: `${-swap * 350}px ${(1 - enter(f, 20)) * 100}px`,
            transform: `rotateY(${-swap * 24}deg) rotateX(4deg)`,
            rotate: `${-3 - swap * 7}deg`,
            scale: interpolate(f, [20, 75], [0.91, 1], {
              ...clamp,
              easing: ease,
            }),
          }}
        >
          <Browser
            project="erm-system"
            url={copy.applications.erm}
            width={portrait ? 870 : 1220}
            height={portrait ? 660 : 590}
          />
        </div>
        <div
          style={{
            position: "absolute",
            opacity: swap,
            translate: `${(1 - swap) * 470}px ${(1 - swap) * 50}px`,
            transform: `rotateY(${(1 - swap) * 25}deg)`,
            rotate: `${3 - swap * 3}deg`,
            scale: 0.96 + swap * 0.04,
          }}
        >
          <Browser
            project="work-buddy"
            url={copy.applications.buddy}
            width={portrait ? 870 : 1220}
            height={portrait ? 660 : 590}
          />
        </div>
      </div>
      <div
        style={{
          fontSize: portrait ? 35 : 32,
          color: color.muted,
          paddingBottom: portrait ? 100 : 12,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <span
          style={{
            display: "inline-block",
            height: 9,
            width: 9,
            borderRadius: "50%",
            background: color.mint,
          }}
        />
        {copy.applications.support}
      </div>
    </Frame>
  );
};

const ToolIcon = ({ kind, x, y }: { kind: number; x: number; y: number }) => (
  <g
    transform={`translate(${x - 30} ${y - 30})`}
    stroke={color.mint}
    strokeWidth="3.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {kind === 0 ? (
      <>
        <path d="M8 24h44l-5 31H13L8 24Z" />
        <path d="m18 24 8-17m16 17L34 7M23 35v10m14-10v10" />
      </>
    ) : kind === 1 ? (
      <>
        <ellipse cx="30" cy="12" rx="22" ry="8" />
        <path d="M8 12v33c0 11 44 11 44 0V12M8 28c0 11 44 11 44 0" />
      </>
    ) : (
      <>
        <circle cx="30" cy="17" r="10" />
        <path d="M10 53v-8c0-17 40-17 40 0v8M10 12a8 8 0 0 0 0 16M50 12a8 8 0 0 1 0 16" />
      </>
    )}
  </g>
);

export const Connections = () => {
  const copy = useFilmCopy();
  const f = useCurrentFrame();
  const { portrait } = useFormat();
  const nodes = portrait
    ? [
        [450, 170],
        [450, 470],
        [450, 770],
      ]
    : [
        [245, 240],
        [800, 240],
        [1355, 240],
      ];
  const svgWidth = portrait ? 900 : 1600;
  const svgHeight = portrait ? 1000 : 500;
  return (
    <Frame theme="mint" number="04" label={copy.connections.label}>
      <div style={{ paddingTop: portrait ? 90 : 55 }}>
        <Title
          lines={portrait ? copy.connections.portrait : copy.connections.wide}
          size={portrait ? 126 : 168}
        />
      </div>
      <div
        style={{
          fontSize: portrait ? 40 : 44,
          marginTop: 28,
          opacity: enter(f, 25),
          maxWidth: portrait ? 750 : 1300,
          lineHeight: 1.3,
        }}
      >
        {copy.connections.support}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ overflow: "visible" }}
        >
          {[0, 1].map((i) => {
            const a = nodes[i],
              b = nodes[i + 1];
            const path = portrait
              ? `M${a[0]} ${a[1] + 83}V${b[1] - 83}`
              : `M${a[0] + 150} ${a[1]}H${b[0] - 150}`;
            const progress = enter(f, 24 + i * 15, 35);
            return (
              <g key={i}>
                <path d={path} stroke="#0b151126" strokeWidth="2" fill="none" />
                <path
                  d={path}
                  stroke={color.ink}
                  strokeWidth="3"
                  fill="none"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - progress}
                />
                {[0, 1, 2].map((j) => {
                  const t = (f / 65 + j / 3 + i * 0.15) % 1;
                  return (
                    <circle
                      key={j}
                      cx={
                        portrait ? a[0] : a[0] + 150 + t * (b[0] - a[0] - 300)
                      }
                      cy={portrait ? a[1] + 83 + t * (b[1] - a[1] - 166) : a[1]}
                      r={7}
                      fill={color.ink}
                      opacity={progress * 0.8}
                    />
                  );
                })}
              </g>
            );
          })}
          {nodes.map(([x, y], i) => {
            const reveal = enter(f, 14 + i * 12, 27);
            return (
              <g
                key={i}
                transform={`translate(${x} ${y + (1 - reveal) * 70}) scale(${0.9 + reveal * 0.1}) translate(${-x} ${-y})`}
                opacity={reveal}
              >
                <rect
                  x={x - 150}
                  y={y - 83}
                  width={300}
                  height={166}
                  rx={24}
                  fill={color.ink}
                />
                <ToolIcon kind={i} x={x} y={y - 15} />
                <text
                  x={x}
                  y={y + 52}
                  textAnchor="middle"
                  fill={color.paper}
                  fontSize={26}
                  fontFamily="StudioSans"
                  fontWeight={600}
                  letterSpacing={2}
                >
                  {copy.connections.nodes[i]}
                </text>
                <circle cx={x + 128} cy={y - 62} r={6} fill={color.mint} />
              </g>
            );
          })}
        </svg>
      </div>
      <div
        style={{
          fontSize: portrait ? 33 : 32,
          paddingBottom: portrait ? 55 : 5,
          display: "flex",
          gap: portrait ? 25 : 42,
          alignItems: "center",
          opacity: enter(f, 75),
        }}
      >
        <span>{copy.connections.terms[0]}</span>
        <span style={{ opacity: 0.3 }}>/</span>
        <span>{copy.connections.terms[1]}</span>
        <span style={{ opacity: 0.3 }}>/</span>
        <span>{copy.connections.terms[2]}</span>
      </div>
    </Frame>
  );
};

export const Personal = () => {
  const copy = useFilmCopy();
  const f = useCurrentFrame();
  const { portrait } = useFormat();
  const p = enter(f, 19, 42);
  return (
    <Frame number="05" label={copy.personal.label}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          background: "radial-gradient(ellipse,#00b87a19,transparent 65%)",
          right: -300,
          top: -30,
        }}
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: portrait ? 65 : 90,
          flexDirection: portrait ? "column" : "row",
          paddingTop: portrait ? 50 : 0,
        }}
      >
        <div style={{ width: portrait ? "100%" : "58%", zIndex: 2 }}>
          <Title
            lines={copy.personal.title}
            size={copy.personal.size[portrait ? 0 : 1]}
            accent={1}
          />
          <div
            style={{
              fontSize: portrait ? 44 : 43,
              marginTop: portrait ? 35 : 52,
              opacity: enter(f, 53),
              color: color.paper,
            }}
          >
            Oleksandr Dzisiak
          </div>
          <div
            style={{
              fontSize: portrait ? 27 : 27,
              lineHeight: 1.6,
              color: color.muted,
              marginTop: 12,
              opacity: enter(f, 65),
            }}
          >
            {copy.personal.roles[0]}
            <br />
            {copy.personal.roles[1]}
          </div>
        </div>
        <div
          style={{
            width: portrait ? 640 : 560,
            height: portrait ? 680 : 650,
            perspective: 1400,
            flexShrink: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -35,
              border: "1px solid #a2f2c844",
              borderRadius: 250,
              rotate: `${-15 + f * 0.08}deg`,
              scale: 0.85 + p * 0.15,
            }}
          />
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "150px 150px 32px 32px",
              overflow: "hidden",
              background: color.mint,
              opacity: p,
              transform: `rotateY(${(1 - p) * 65}deg)`,
              translate: `${(1 - p) * 70}px 0`,
              rotate: `${(1 - p) * 6}deg`,
            }}
          >
            <Img
              src={staticFile("brand/portrait.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 40%",
                scale: 1.07 - (f / 195) * 0.055,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -24,
              right: -24,
              width: 126,
              height: 126,
              borderRadius: "50%",
              background: color.mint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              rotate: `${interpolate(f, [45, 78], [-80, 0], { ...clamp, easing: ease })}deg`,
              scale: enter(f, 45, 30),
            }}
          >
            <Img
              src={staticFile("brand/logo-dark.svg")}
              style={{ width: 66, height: 77 }}
            />
          </div>
        </div>
      </div>
    </Frame>
  );
};

export const Closing = () => {
  const copy = useFilmCopy();
  const f = useCurrentFrame();
  const { portrait } = useFormat();
  return (
    <Frame theme="paper" number="06" label={copy.closing.label}>
      <Grid light />
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: portrait ? "flex-start" : "center",
          justifyContent: "center",
          flexDirection: portrait ? "column" : "row",
          gap: portrait ? 10 : 0,
        }}
      >
        <div
          style={{
            width: portrait ? "100%" : "65%",
            zIndex: 2,
            paddingTop: portrait ? 100 : 0,
          }}
        >
          <Title lines={copy.closing.title} size={portrait ? 118 : 140} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              marginTop: portrait ? 65 : 72,
              opacity: enter(f, 35),
              translate: `0 ${(1 - enter(f, 35)) * 28}px`,
            }}
          >
            <div
              style={{
                fontSize: portrait ? 140 : 164,
                fontWeight: 700,
                letterSpacing: "-.07em",
                lineHeight: 1.1,
              }}
            >
              o-d.dev
            </div>
            <Arrow
              size={portrait ? 85 : 90}
              stroke={color.green}
              style={{
                rotate: `${interpolate(f, [40, 80], [-45, 0], { ...clamp, easing: ease })}deg`,
              }}
            />
          </div>
          <div
            style={{
              height: 5,
              width: interpolate(f, [42, 80], [0, portrait ? 610 : 700], {
                ...clamp,
                easing: ease,
              }),
              background: color.green,
              marginTop: 16,
            }}
          />
          <div
            style={{
              fontSize: portrait ? 31 : 30,
              marginTop: 30,
              letterSpacing: ".04em",
              color: "#426350",
              opacity: enter(f, 65),
            }}
          >
            {copy.closing.services}
          </div>
        </div>
        <div
          style={{
            width: portrait ? 800 : 710,
            height: portrait ? 700 : 710,
            marginLeft: portrait ? 40 : -85,
            marginTop: portrait ? -20 : 0,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandModel size={portrait ? 800 : 710} light />
        </div>
      </div>
    </Frame>
  );
};
