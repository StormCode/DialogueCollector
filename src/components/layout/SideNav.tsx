import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import { BentoIcon, MaterialIcon } from "../icons/Icon";
import { useUiStore } from "../../stores/uiStore";
import "./SideNav.css";

export function SideNav() {
  const { t } = useTranslation();
  const expanded = useUiStore((s) => s.navExpanded);
  const toggle = useUiStore((s) => s.toggleNav);

  const items = [
    // Boards: Bento Home, Material book_2, Bento Gear (resolves to GearWeightRegular).
    { to: "/", end: true, label: t("nav.home"), icon: <BentoIcon name="Home" /> },
    { to: "/characters", end: false, label: t("nav.scriptBook"), icon: <MaterialIcon name="book_2" /> },
    { to: "/settings", end: false, label: t("nav.settings"), icon: <BentoIcon name="GearWeightRegular" /> },
  ];

  // Collapsing slides the whole widget off the right edge, leaving the toggle tab showing
  // (the boards' chevrons: › tucks it away, ‹ pulls it back). Its links go inert meanwhile so
  // keyboard focus never lands off-screen.
  return (
    <nav className={`side-nav${expanded ? "" : " is-collapsed"}`} aria-label={t("app.title")}>
      <button
        type="button"
        className="side-nav__toggle"
        aria-label={expanded ? t("nav.collapse") : t("nav.expand")}
        aria-expanded={expanded}
        onClick={toggle}
      >
        <BentoIcon name={expanded ? "ChevronRight" : "ChevronLeft"} size={16} />
      </button>
      <div className="side-nav__items" inert={!expanded}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `side-nav__item${isActive ? " is-active" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
