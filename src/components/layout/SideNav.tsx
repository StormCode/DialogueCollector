import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import bookIcon from "../../assets/icons/book_2.svg";
import { useUiStore } from "../../stores/uiStore";
import "./SideNav.css";

// Material Symbols Outlined (Apache-2.0), wght 200. Only book_2 ships as a file so far.
const HomeIcon = () => (
  <svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true" fill="currentColor">
    <path d="M240-200h147.69v-235.38h184.62V-200H720v-360L480-741.54 240-560v360Zm-40 40v-420l280-211.54L760-580v420H532.31v-235.38H427.69V-160H200Zm280-310.77Z" />
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true" fill="currentColor">
    <path d="m405.38-120-14.46-115.69q-19.15-5.77-41.42-18.16-22.27-12.38-37.88-26.53L204.92-235l-74.61-130 92.23-69.54q-1.77-10.84-2.92-22.34-1.16-11.5-1.16-22.35 0-10.08 1.16-21.19 1.15-11.12 2.92-25.04L130.31-595l74.61-128.46 105.93 44.61q17.92-14.92 38.77-26.92 20.84-12 40.53-18.54L405.38-840h149.24l14.46 116.46q23 8.08 40.65 18.54 17.65 10.46 36.35 26.15l109-44.61L829.69-595l-95.31 71.85q3.31 12.38 3.7 22.73.38 10.34.38 20.42 0 9.31-.77 19.65-.77 10.35-3.54 25.04L827.92-365l-74.61 130-107.23-46.15q-18.7 15.69-37.62 26.92-18.92 11.23-39.38 17.77L554.62-120H405.38ZM440-160h78.23L533-268.31q30.23-8 54.42-21.96 24.2-13.96 49.27-38.27L736.46-286l39.77-68-87.54-65.77q5-17.08 6.62-31.42 1.61-14.35 1.61-28.81 0-15.23-1.61-28.81-1.62-13.57-6.62-29.88L777.77-606 738-674l-102.08 42.77q-18.15-19.92-47.73-37.35-29.57-17.42-55.96-21.11L520-800h-79.77l-12.46 107.54q-30.23 6.46-55.58 20.81-25.34 14.34-50.42 39.42L222-674l-39.77 68L269-541.23q-5 13.46-7 29.23t-2 32.77q0 15.23 2 30.23t6.23 29.23l-86 65.77L222-286l99-42q23.54 23.77 48.88 38.12 25.35 14.34 57.12 22.34L440-160Zm38.92-220q41.85 0 70.93-29.08 29.07-29.07 29.07-70.92t-29.07-70.92Q520.77-580 478.92-580q-42.07 0-71.04 29.08-28.96 29.07-28.96 70.92t28.96 70.92Q436.85-380 478.92-380ZM480-480Z" />
  </svg>
);
const Chevron = ({ right }: { right: boolean }) => (
  <svg viewBox="0 -960 960 960" width="16" height="16" aria-hidden="true" fill="currentColor">
    <path
      d={
        right
          ? "M517.85-480 330.31-667.54 360-697.23 577.23-480 360-262.77l-29.69-29.69L517.85-480Z"
          : "M560-262.77 342.77-480 560-697.23l29.69 29.69L402.15-480l187.54 187.54L560-262.77Z"
      }
    />
  </svg>
);

export function SideNav() {
  const { t } = useTranslation();
  const expanded = useUiStore((s) => s.navExpanded);
  const toggle = useUiStore((s) => s.toggleNav);

  const items = [
    { to: "/", end: true, label: t("nav.home"), icon: <HomeIcon /> },
    {
      to: "/characters",
      end: false,
      label: t("nav.scriptBook"),
      icon: <img src={bookIcon} alt="" width={24} height={24} className="side-nav__img" />,
    },
    { to: "/settings", end: false, label: t("nav.settings"), icon: <SettingsIcon /> },
  ];

  return (
    <nav className="side-nav" aria-label={t("app.title")}>
      <button
        type="button"
        className="side-nav__toggle"
        aria-label={expanded ? t("nav.collapse") : t("nav.expand")}
        aria-expanded={expanded}
        onClick={toggle}
      >
        <Chevron right={expanded} />
      </button>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `side-nav__item${isActive ? " is-active" : ""}`}
          aria-label={expanded ? undefined : item.label}
        >
          {item.icon}
          {expanded && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}
