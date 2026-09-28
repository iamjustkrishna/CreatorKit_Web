export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=space.iamjustkrishna.creatorkit";
export const GITHUB_URL = "https://github.com/iamjustkrishna/CreatorKit";
export const PRIVACY_URL = "https://iamjustkrishna.github.io/privacy-policies/";

export function PlayStoreMark() {
  return (
    <svg
      viewBox="0 0 32 36"
      aria-hidden="true"
      className="play-mark"
      fill="none"
    >
      <path d="M1.8 1.6 18.5 18 1.9 34.4a4 4 0 0 1-.9-2.6V4.2c0-1 .3-1.9.8-2.6Z" fill="#00D1FF" />
      <path d="m18.5 18 5.4-5.3 6.1 3.5c1.4.8 1.4 2.8 0 3.6l-6.1 3.5-5.4-5.3Z" fill="#FFD54A" />
      <path d="M1.8 1.6A3.9 3.9 0 0 1 6.7.8l17.2 9.9-5.4 5.3L1.8 1.6Z" fill="#29E28B" />
      <path d="m18.5 20 5.4 5.3-17.2 9.9a3.9 3.9 0 0 1-4.8-.8L18.5 20Z" fill="#FF5B62" />
    </svg>
  );
}

export default function StoreButton({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className={`store-button magnetic${compact ? " store-button--compact" : ""}`}
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Get CreatorKit on Google Play"
    >
      <PlayStoreMark />
      <span>
        <small>Get it on</small>
        Google Play
      </span>
    </a>
  );
}
