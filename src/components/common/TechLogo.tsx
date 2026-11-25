import {
  siAnthropic,
  siCss3,
  siDocker,
  siExpress,
  siFastapi,
  siFigma,
  siFlask,
  siGit,
  siGithub,
  siGithubcopilot,
  siGooglecolab,
  siHtml5,
  siHuggingface,
  siJavascript,
  siJupyter,
  siLangchain,
  siMongodb,
  siMysql,
  siNetlify,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siOllama,
  siOpenai,
  siPandas,
  siPostgresql,
  siPostman,
  siPython,
  siPytorch,
  siReact,
  siRender,
  siReplit,
  siScikitlearn,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from 'simple-icons';

interface TechLogoProps {
  logoKey: string;
  name: string;
  className?: string;
}

const SIMPLE_ICON_MAP: Record<string, SimpleIcon> = {
  python: siPython,
  javascript: siJavascript,
  typescript: siTypescript,
  html5: siHtml5,
  css3: siCss3,
  react: siReact,
  nextjs: siNextdotjs,
  tailwindcss: siTailwindcss,
  nodejs: siNodedotjs,
  expressjs: siExpress,
  fastapi: siFastapi,
  flask: siFlask,
  mysql: siMysql,
  mongodb: siMongodb,
  postgresql: siPostgresql,
  numpy: siNumpy,
  pandas: siPandas,
  scikitlearn: siScikitlearn,
  tensorflow: siTensorflow,
  pytorch: siPytorch,
  langchain: siLangchain,
  huggingface: siHuggingface,
  ollama: siOllama,
  replit: siReplit,
  claude: siAnthropic,
  openai: siOpenai,
  githubcopilot: siGithubcopilot,
  docker: siDocker,
  vercel: siVercel,
  netlify: siNetlify,
  render: siRender,
  git: siGit,
  github: siGithub,
  postman: siPostman,
  jupyter: siJupyter,
  googlecolab: siGooglecolab,
  figma: siFigma,
};

const CUSTOM_BRAND_SVG: Record<string, { viewBox: string; color: string; path: string }> = {
  aws: {
    viewBox: '0 0 24 24',
    color: '#FF9900',
    path: 'M6.76 10.67c0 .54.06.98.17 1.31.12.33.27.68.47 1.07.07.12.11.23.11.34 0 .14-.09.28-.26.41l-.88.59c-.12.09-.24.13-.35.13-.14 0-.28-.07-.42-.2-.2-.21-.37-.44-.5-.67-.13-.24-.26-.51-.39-.83-.99 1.17-2.23 1.75-3.73 1.75-1.06 0-1.91-.3-2.54-.91-.63-.6-.95-1.41-.95-2.42 0-1.07.38-1.94 1.14-2.6.76-.66 1.78-.99 3.07-.99.43 0 .87.03 1.33.1.46.07.94.17 1.44.3V7.1c0-.98-.2-1.67-.61-2.07-.41-.4-1.11-.6-2.1-.6-.45 0-.91.05-1.39.17-.48.11-.95.26-1.41.44a2.8 2.8 0 0 1-.46.16c-.1 0-.16-.08-.16-.25v-.66c0-.14.02-.25.07-.32.05-.07.14-.14.28-.21.45-.23.99-.42 1.62-.57.63-.15 1.3-.22 2.02-.22 1.54 0 2.67.35 3.39 1.05.71.7 1.07 1.76 1.07 3.17v4.17zM16.92 17.57c-2.38 1.76-5.84 2.7-8.82 2.7-4.18 0-7.95-1.55-10.79-4.12-.22-.2-.02-.48.24-.32 3.07 1.79 6.87 2.87 10.79 2.87 2.65 0 5.56-.55 8.24-1.69.4-.18.74.26.34.56zm1-.98c-.3-.39-1.99-.18-2.75-.09-.23.03-.27-.17-.06-.32 1.35-.95 3.56-.68 3.82-.36.26.32-.07 2.53-1.33 3.59-.19.16-.38.07-.29-.14.28-.71.92-2.29.61-2.68z',
  },
  vscode: {
    viewBox: '0 0 24 24',
    color: '#007ACC',
    path: 'M17.583 2.008a1.5 1.5 0 0 0-.98.384l-8.17 7.45-4.43-3.36a1 1 0 0 0-1.28.08L1.32 7.86a1 1 0 0 0 0 1.48L4.98 12l-3.66 2.66a1 1 0 0 0 0 1.48l1.403 1.298a1 1 0 0 0 1.28.08l4.43-3.36 8.17 7.45a1.5 1.5 0 0 0 2.497-1.12V3.52a1.5 1.5 0 0 0-1.517-1.512zM17 6.8v10.4L11.2 12 17 6.8z',
  },
  cursor: {
    viewBox: '0 0 24 24',
    color: '#E5E2DC',
    path: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.3l6.8 3.78L12 11.86 5.2 8.08 12 4.3zm-7 5.5l6 3.33v6.56l-6-3.33V9.8zm14 0v6.56l-6 3.33v-6.56L19 9.8z',
  },
  sql: {
    viewBox: '0 0 24 24',
    color: '#38BDF8',
    path: 'M12 3C7.03 3 3 4.79 3 7v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 1.12 7 2s-3.13 2-7 2-7-1.12-7-2 3.13-2 7-2zm0 14c-3.87 0-7-1.12-7-2v-2.23c1.61 1.07 4.19 1.73 7 1.73s5.39-.66 7-1.73V17c0 .88-3.13 2-7 2zm0-4.5c-3.87 0-7-1.12-7-2v-2.23C6.61 11.34 9.19 12 12 12s5.39-.66 7-1.73V12.5c0 .88-3.13 2-7 2z',
  },
  restapis: {
    viewBox: '0 0 24 24',
    color: '#FB923C',
    path: 'M7 7h4v2H7a3 3 0 0 0 0 6h4v2H7a5 5 0 0 1 0-10zm6 0h4a5 5 0 0 1 0 10h-4v-2h4a3 3 0 0 0 0-6h-4V7zm-4 4h6v2H9v-2z',
  },
  llms: {
    viewBox: '0 0 24 24',
    color: '#F59E0B',
    path: 'M12 2a4 4 0 0 1 3.87 3h.63A3.5 3.5 0 0 1 20 8.5c0 1.11-.52 2.1-1.33 2.74.21.56.33 1.16.33 1.76a5 5 0 0 1-3.5 4.77V21h-2v-3h-3v3H8.5v-3.23A5 5 0 0 1 5 13c0-.6.12-1.2.33-1.76A3.5 3.5 0 0 1 7.5 5h.63A4 4 0 0 1 12 2zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  },
  rag: {
    viewBox: '0 0 24 24',
    color: '#34D399',
    path: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm11.5 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-2.5 3h5',
  },
  promptengineering: {
    viewBox: '0 0 24 24',
    color: '#A78BFA',
    path: 'M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4V5zm4 4l3 2.5L8 14v-1.8l1.7-.7L8 10.8V9zm5 4h4v1.5h-4V13z',
  },
  aiagents: {
    viewBox: '0 0 24 24',
    color: '#FB923C',
    path: 'M12 2l2.2 4.4L19 7l-3.5 3.4.8 4.8L12 13l-4.3 2.2.8-4.8L5 7l4.8-.6L12 2zm-6 15h12v2H6v-2zm2 3h8v2H8v-2z',
  },
  lovable: {
    viewBox: '0 0 24 24',
    color: '#F43F5E',
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
};

export function TechLogo({ logoKey, name, className = 'h-7 w-7' }: TechLogoProps) {
  const icon = SIMPLE_ICON_MAP[logoKey];

  if (icon) {
    const color =
      icon.hex === '000000' || icon.hex === '181717' ? '#F5F3EF' : `#${icon.hex}`;
    return (
      <svg
        viewBox="0 0 24 24"
        fill={color}
        className={className}
        role="img"
        aria-label={name}
      >
        <path d={icon.path} />
      </svg>
    );
  }

  const custom = CUSTOM_BRAND_SVG[logoKey];
  if (custom) {
    return (
      <svg
        viewBox={custom.viewBox}
        fill={custom.color}
        className={className}
        role="img"
        aria-label={name}
      >
        <path d={custom.path} />
      </svg>
    );
  }

  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 font-mono text-xs font-semibold text-smoke-100"
      aria-label={name}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
