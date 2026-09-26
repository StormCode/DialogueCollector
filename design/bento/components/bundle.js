/* @ds-bundle: {"format":4,"namespace":"BentoDS27_65ebe9","components":[{"name":"Actions","sourcePath":"components/actions/Actions.jsx"},{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Link","sourcePath":"components/actions/Link.jsx"},{"name":"BarChart","sourcePath":"components/dataviz/BarChart.jsx"},{"name":"ChartTooltip","sourcePath":"components/dataviz/ChartTooltip.jsx"},{"name":"DonutChart","sourcePath":"components/dataviz/DonutChart.jsx"},{"name":"Legend","sourcePath":"components/dataviz/Legend.jsx"},{"name":"LineChart","sourcePath":"components/dataviz/LineChart.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Chip","sourcePath":"components/display/Chip.jsx"},{"name":"Divider","sourcePath":"components/display/Divider.jsx"},{"name":"ListItem","sourcePath":"components/display/List.jsx"},{"name":"List","sourcePath":"components/display/List.jsx"},{"name":"Pagination","sourcePath":"components/display/Pagination.jsx"},{"name":"Table","sourcePath":"components/display/Table.jsx"},{"name":"AreaLoader","sourcePath":"components/feedback/AreaLoader.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"Disclosure","sourcePath":"components/feedback/Disclosure.jsx"},{"name":"Feedback","sourcePath":"components/feedback/Feedback.jsx"},{"name":"InlineLoader","sourcePath":"components/feedback/InlineLoader.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Datepicker","sourcePath":"components/forms/Datepicker.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"FieldTip","sourcePath":"components/forms/FieldTip.jsx"},{"name":"FileUploader","sourcePath":"components/forms/FileUploader.jsx"},{"name":"RadioButton","sourcePath":"components/forms/RadioButton.jsx"},{"name":"SearchBar","sourcePath":"components/forms/SearchBar.jsx"},{"name":"SelectField","sourcePath":"components/forms/SelectField.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"FolderTab","sourcePath":"components/navigation/FolderTab.jsx"},{"name":"Menu","sourcePath":"components/navigation/Menu.jsx"},{"name":"NavigationItem","sourcePath":"components/navigation/NavigationItem.jsx"},{"name":"Stepper","sourcePath":"components/navigation/Stepper.jsx"},{"name":"StepperItem","sourcePath":"components/navigation/StepperItem.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"UnderlineTab","sourcePath":"components/navigation/UnderlineTab.jsx"}],"sourceHashes":{"components/actions/Actions.jsx":"de9158249ba9","components/actions/Button.jsx":"d9e37b6dc894","components/actions/IconButton.jsx":"e84150fb7b05","components/actions/Link.jsx":"d39b611aa3a6","components/dataviz/BarChart.jsx":"c83345b3dd28","components/dataviz/ChartTooltip.jsx":"88130e92adb0","components/dataviz/DonutChart.jsx":"b9aa160fde2d","components/dataviz/Legend.jsx":"e8cf5e8fcc95","components/dataviz/LineChart.jsx":"15129245d310","components/display/Avatar.jsx":"6c0d7c8929e7","components/display/Card.jsx":"d6c5d6de0d2a","components/display/Chip.jsx":"d6472488aff4","components/display/Divider.jsx":"c56c70259fb6","components/display/List.jsx":"905fdce5b8dd","components/display/Pagination.jsx":"0fbb2e07b5da","components/display/Table.jsx":"12d746edb847","components/feedback/AreaLoader.jsx":"eaffe2c11ead","components/feedback/Banner.jsx":"ad55ac81ae7c","components/feedback/Disclosure.jsx":"38008ab3d986","components/feedback/Feedback.jsx":"ca258f151859","components/feedback/InlineLoader.jsx":"8a07531fa272","components/feedback/Modal.jsx":"483aee416ab6","components/feedback/ProgressBar.jsx":"7aed5aea0bca","components/feedback/Toast.jsx":"7a7926de586a","components/feedback/Tooltip.jsx":"052b837e548f","components/forms/Checkbox.jsx":"37fcca7bc8db","components/forms/Datepicker.jsx":"7c2c25477caa","components/forms/Field.jsx":"ff0ce377c55b","components/forms/FieldTip.jsx":"324e0c31423c","components/forms/FileUploader.jsx":"eb85b75f40ab","components/forms/RadioButton.jsx":"3337dee00d0f","components/forms/SearchBar.jsx":"deb37ed4820a","components/forms/SelectField.jsx":"235a1176dd52","components/forms/Slider.jsx":"0c34e3ba2282","components/forms/Switch.jsx":"b419d217faf1","components/icons/Icon.jsx":"7469fbc1e183","components/icons/icon-data.js":"7a7c67440575","components/navigation/Breadcrumb.jsx":"a65e2984f978","components/navigation/FolderTab.jsx":"b21beaede6ac","components/navigation/Menu.jsx":"16b48c2a7829","components/navigation/NavigationItem.jsx":"d5f7eb8b86f0","components/navigation/Stepper.jsx":"8a147cb31036","components/navigation/StepperItem.jsx":"2f40fb30faed","components/navigation/TabBar.jsx":"7e804a373f99","components/navigation/UnderlineTab.jsx":"acde64d0cee6","ui_kits/templates/AppShell.jsx":"f0f249bcadf2","ui_kits/templates/InvoiceForm.jsx":"ab13dfc77b83","ui_kits/templates/InvoiceList.jsx":"0915182e3272","ui_kits/templates/Settings.jsx":"90babe73bca1","ui_kits/templates/SignIn.jsx":"b5913fa3d16d"},"inlinedExternals":[],"unexposedExports":[{"name":"resolveIconName","sourcePath":"components/icons/Icon.jsx"}]} */

(() => {

const __ds_ns = (window.BentoDS27_65ebe9 = window.BentoDS27_65ebe9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/dataviz/BarChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const HUES = ['violet', 'blue', 'jade', 'orange', 'red', 'yellow', 'indigo', 'pink', 'green'];
const AXIS = 'var(--bento-neutral-50)';
const TICK_FONT = 'var(--bento-weight-regular) 12px/18px var(--bento-font-ui)';
// Source frame: 560x320 with a 514x253 plot area, 4px bar gaps, 1px axes.
// Bar thickness there is 85.667px single / 38.444px grouped; those are caps, while the
// plot divides its real width so the chart stays correct when scaled below 560.
const MAX_BAR = {
  single: 85.667,
  grouped: 38.444
};
function BarChart({
  data = [],
  orientation = 'vertical',
  grouped = false,
  max,
  width = 560,
  height = 320,
  style,
  ...rest
}) {
  const values = data.flatMap(d => grouped ? d.values || [] : [d.value || 0]);
  const top = max != null ? max : Math.max(1, ...values);
  const vertical = orientation === 'vertical';
  const cap = grouped ? MAX_BAR.grouped : MAX_BAR.single;
  const ticks = [top, top / 2, 0];
  const bar = (v, si) => {
    const pct = Math.max(0, Math.min(1, v / top)) * 100 + '%';
    const color = `var(--bento-dv-${HUES[si % HUES.length]}-50)`;
    return vertical ? {
      height: pct,
      width: '100%',
      maxWidth: cap,
      background: color
    } : {
      width: pct,
      flex: 1,
      minHeight: 0,
      maxHeight: cap,
      background: color
    };
  };
  const group = (d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      display: 'flex',
      flexDirection: vertical ? 'row' : 'column',
      alignItems: vertical ? 'flex-end' : 'flex-start',
      justifyContent: 'center',
      gap: 4
    }
  }, (grouped ? d.values || [] : [d.value || 0]).map((v, si) => /*#__PURE__*/React.createElement("div", {
    key: si,
    style: bar(v, grouped ? si : i)
  })));
  const axisLabels = items => items.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: vertical ? 'center' : 'flex-end',
      font: TICK_FONT,
      color: 'var(--bento-content-secondary)',
      whiteSpace: 'nowrap'
    }
  }, l));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      boxSizing: 'border-box',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: 4,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      paddingRight: 4,
      justifyContent: vertical ? 'space-between' : 'stretch',
      alignItems: 'flex-end',
      gap: vertical ? 0 : 4
    }
  }, vertical ? ticks.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      font: TICK_FONT,
      color: 'var(--bento-content-secondary)'
    }
  }, Math.round(t))) : axisLabels(data.map(d => d.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: AXIS,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: vertical ? 'row' : 'column',
      alignItems: 'stretch',
      gap: 4
    }
  }, data.map(group))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 4,
      paddingLeft: 36
    }
  }, vertical ? axisLabels(data.map(d => d.label)) : ticks.slice().reverse().map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      minWidth: 0,
      font: TICK_FONT,
      color: 'var(--bento-content-secondary)',
      textAlign: i === 0 ? 'left' : i === ticks.length - 1 ? 'right' : 'center'
    }
  }, Math.round(t)))));
}
Object.assign(__ds_scope, { BarChart, __ds_default_components_dataviz_BarChart_fbgi6b: BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/dataviz/ChartTooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const HUES = ['blue', 'red', 'violet', 'green', 'orange', 'yellow', 'jade', 'indigo', 'pink'];
function ChartTooltip({
  title = '',
  rows = [],
  kind = 'area',
  width = 188,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      borderRadius: 12,
      boxSizing: 'border-box',
      background: 'var(--bento-bg-primary)',
      boxShadow: 'inset 0 0 0 1px var(--bento-neutral-5), var(--bento-elevation-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 16,
      ...style
    }
  }, rest), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: `var(--bento-weight-regular) ${kind === 'line' ? 11 : 12}px/${kind === 'line' ? 14 : 16}px var(--bento-font-legacy)`,
      color: 'var(--bento-content-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      height: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 16,
      height: kind === 'line' ? 3 : 16,
      borderRadius: kind === 'line' ? 1.5 : 8,
      background: r.color || `var(--bento-dv-${HUES[i % HUES.length]}-50)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--bento-weight-regular) 12px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)',
      whiteSpace: 'nowrap'
    }
  }, r.label), r.value != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 12px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)'
    }
  }, r.value)))));
}
Object.assign(__ds_scope, { ChartTooltip, __ds_default_components_dataviz_ChartTooltip_1rzimvt: ChartTooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/ChartTooltip.jsx", error: String((e && e.message) || e) }); }

// components/dataviz/DonutChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const HUES = ['violet', 'blue', 'jade', 'orange', 'red', 'yellow', 'indigo', 'pink', 'green'];
function DonutChart({
  data = [],
  size = 288,
  thickness = 48,
  label,
  sublabel,
  style,
  ...rest
}) {
  const total = data.reduce((a, d) => a + (d.value || 0), 0) || 1;
  let acc = 0;
  const stops = data.map((d, i) => {
    const from = acc / total * 360;
    acc += d.value || 0;
    const to = acc / total * 360;
    const color = d.color || `var(--bento-dv-${HUES[i % HUES.length]}-50)`;
    return `${color} ${from}deg ${to}deg`;
  }).join(', ');
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'center',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      borderRadius: '50%',
      background: `conic-gradient(${stops})`,
      WebkitMask: `radial-gradient(circle, transparent ${size / 2 - thickness}px, #000 ${size / 2 - thickness}px)`,
      mask: `radial-gradient(circle, transparent ${size / 2 - thickness}px, #000 ${size / 2 - thickness}px)`,
      flexShrink: 0
    }
  }), (label || sublabel) && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-title-lg)',
      color: 'var(--bento-content-primary)'
    }
  }, label), sublabel && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-body-sm)',
      color: 'var(--bento-content-secondary)',
      marginTop: 4
    }
  }, sublabel)));
}
Object.assign(__ds_scope, { DonutChart, __ds_default_components_dataviz_DonutChart_1dg6p88: DonutChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/DonutChart.jsx", error: String((e && e.message) || e) }); }

// components/dataviz/Legend.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const HUES = ['blue', 'red', 'violet', 'green', 'orange', 'yellow', 'jade', 'indigo', 'pink'];
function Legend({
  items = [],
  orientation = 'vertical',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      gap: orientation === 'vertical' ? 8 : 16,
      alignItems: 'flex-start',
      ...style
    }
  }, rest), items.map((it, i) => {
    const kind = it.kind || 'area';
    const color = it.color || `var(--bento-dv-${HUES[i % HUES.length]}-50)`;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        height: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 16,
        height: kind === 'line' ? 3 : 16,
        borderRadius: kind === 'line' ? 1.5 : 8,
        background: color
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--bento-weight-medium) 12px/16px var(--bento-font-legend)',
        color: 'rgba(34,39,49,0.87)',
        whiteSpace: 'nowrap'
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { Legend, __ds_default_components_dataviz_Legend_t99nvv: Legend });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/Legend.jsx", error: String((e && e.message) || e) }); }

// components/dataviz/LineChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const HUES = ['blue', 'red', 'violet', 'green', 'orange', 'yellow', 'jade', 'indigo', 'pink'];
const AXIS = 'var(--bento-neutral-50)';
const TICK_FONT = 'var(--bento-weight-regular) 12px/18px var(--bento-font-ui)';
function LineChart({
  series = [],
  labels = [],
  area = false,
  max,
  width = 560,
  height = 320,
  style,
  ...rest
}) {
  const all = series.flatMap(s => s.values || []);
  const top = max != null ? max : Math.max(1, ...all);
  const plot = {
    w: 514,
    h: 253
  };
  const pointsFor = vals => vals.map((v, i) => {
    const x = vals.length > 1 ? i / (vals.length - 1) * plot.w : 0;
    const y = plot.h - Math.max(0, Math.min(1, v / top)) * plot.h;
    return [x, y];
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      boxSizing: 'border-box',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: 4,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingRight: 4
    }
  }, [top, top / 2, 0].map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      font: TICK_FONT,
      color: 'var(--bento-content-secondary)'
    }
  }, Math.round(t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: AXIS,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${plot.w} ${plot.h}`,
    preserveAspectRatio: "none",
    style: {
      width: '100%',
      height: '100%',
      display: 'block',
      overflow: 'visible'
    }
  }, series.map((s, si) => {
    const pts = pointsFor(s.values || []);
    if (!pts.length) return null;
    const color = s.color || `var(--bento-dv-${HUES[si % HUES.length]}-50)`;
    const line = pts.map(p => p.join(',')).join(' ');
    return /*#__PURE__*/React.createElement("g", {
      key: si
    }, area && /*#__PURE__*/React.createElement("polygon", {
      points: `0,${plot.h} ${line} ${plot.w},${plot.h}`,
      fill: color,
      opacity: "0.16"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: line,
      fill: "none",
      stroke: color,
      strokeWidth: "3",
      strokeLinejoin: "round",
      strokeLinecap: "round",
      vectorEffect: "non-scaling-stroke"
    }));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 32
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      font: TICK_FONT,
      color: 'var(--bento-content-secondary)',
      whiteSpace: 'nowrap'
    }
  }, l))));
}
Object.assign(__ds_scope, { LineChart, __ds_default_components_dataviz_LineChart_aff8ae: LineChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/LineChart.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  padding = 24,
  elevation = 'sm',
  width,
  style,
  ...rest
}) {
  const shadow = {
    none: 'inset 0 0 0 var(--bento-border-width) var(--bento-neutral-5)',
    sm: 'inset 0 0 0 var(--bento-border-width) var(--bento-neutral-5), var(--bento-elevation-sm)',
    md: 'inset 0 0 0 var(--bento-border-width) var(--bento-neutral-5), var(--bento-elevation-md)',
    lg: 'inset 0 0 0 var(--bento-border-width) var(--bento-neutral-5), var(--bento-elevation-lg)'
  }[elevation];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      padding,
      boxSizing: 'border-box',
      borderRadius: 'var(--bento-radius-24)',
      background: 'var(--bento-bg-primary)',
      boxShadow: shadow,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card, __ds_default_components_display_Card_4cna3d: Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Divider({
  orientation = 'horizontal',
  decorative = false,
  length,
  style,
  ...rest
}) {
  if (orientation === 'vertical') {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        display: 'inline-block',
        width: 1,
        height: length || 80,
        flexShrink: 0,
        background: 'var(--bento-neutral-20)',
        ...style
      }
    }, rest));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: length || '100%',
      height: decorative ? 2 : 1,
      borderRadius: decorative ? 1 : 0,
      background: decorative ? 'var(--bento-neutral-20)' : 'rgb(228, 232, 238)',
      flexShrink: 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Divider, __ds_default_components_display_Divider_1o50ypy: Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Divider.jsx", error: String((e && e.message) || e) }); }

// components/feedback/AreaLoader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AreaLoader({
  text = 'Just a moment',
  waitingTime = 'short',
  style,
  ...rest
}) {
  const dots = ['var(--bento-dv-red-40)', 'var(--bento-dv-yellow-40)', 'var(--bento-dv-jade-40)'];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(255, 255, 255, 0.64)',
      backdropFilter: 'blur(2px)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      alignItems: 'center',
      padding: 40,
      borderRadius: 'var(--bento-radius-24)',
      background: 'var(--bento-bg-primary)',
      boxShadow: 'var(--bento-elevation-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, dots.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--bento-radius-full)',
      background: c,
      animation: `bento-bounce 900ms ${i * 150}ms ease-in-out infinite`
    }
  }))), waitingTime === 'long' && text && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, text)), /*#__PURE__*/React.createElement("style", null, '@keyframes bento-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}'));
}
Object.assign(__ds_scope, { AreaLoader, __ds_default_components_feedback_AreaLoader_7kslzy: AreaLoader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/AreaLoader.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProgressBar({
  value = 40,
  max = 100,
  tone = 'interactive',
  width = 400,
  label,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const fill = {
    interactive: 'var(--bento-bg-interactive)',
    positive: 'var(--bento-positive-50)',
    warning: 'var(--bento-warning-40)',
    negative: 'var(--bento-negative-40)'
  }[tone] || 'var(--bento-bg-interactive)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      width,
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-medium) 12px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max,
    style: {
      height: 8,
      borderRadius: 'var(--bento-radius-4)',
      background: 'var(--bento-border-container)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: fill,
      transition: 'width 240ms ease'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar, __ds_default_components_feedback_ProgressBar_1i5r454: ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tooltip({
  text = 'Tooltip',
  placement = 'top',
  style,
  ...rest
}) {
  const arrow = {
    top: {
      bottom: -5,
      left: '50%',
      marginLeft: -4,
      borderWidth: '5px 4px 0 4px',
      borderColor: 'var(--bento-neutral-90) transparent transparent transparent'
    },
    bottom: {
      top: -5,
      left: '50%',
      marginLeft: -4,
      borderWidth: '0 4px 5px 4px',
      borderColor: 'transparent transparent var(--bento-neutral-90) transparent'
    },
    left: {
      right: -5,
      top: '50%',
      marginTop: -4,
      borderWidth: '4px 0 4px 5px',
      borderColor: 'transparent transparent transparent var(--bento-neutral-90)'
    },
    right: {
      left: -5,
      top: '50%',
      marginTop: -4,
      borderWidth: '4px 5px 4px 0',
      borderColor: 'transparent var(--bento-neutral-90) transparent transparent'
    }
  }[placement];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      position: 'relative',
      display: 'inline-block',
      width: 'fit-content',
      padding: '8px 16px',
      borderRadius: 'var(--bento-radius-12)',
      background: 'var(--bento-neutral-90)',
      font: 'var(--bento-weight-medium) 12px/16px var(--bento-font-ui)',
      color: 'var(--bento-content-primary-inverse)',
      textAlign: 'center',
      boxShadow: 'var(--bento-elevation-sm)',
      ...style
    }
  }, rest), text, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      ...arrow
    }
  }));
}
Object.assign(__ds_scope, { Tooltip, __ds_default_components_feedback_Tooltip_1lex2m1: Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function RadioButton({
  label,
  checked = false,
  state = 'enabled',
  name,
  value,
  onChange,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const disabled = state === 'disabled';
  const error = state === 'error';
  const line = error ? 'var(--bento-border-negative)' : disabled ? 'var(--bento-border-input-disabled)' : checked ? 'var(--bento-border-input-focus)' : hover || state === 'hover' || state === 'focus' ? 'var(--bento-border-input-hover)' : 'var(--bento-border-input-enabled)';
  return /*#__PURE__*/React.createElement("label", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      width: 'fit-content',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 24,
      height: 24,
      borderRadius: 'var(--bento-radius-full)',
      background: disabled ? 'var(--bento-bg-secondary)' : 'var(--bento-bg-primary)',
      boxShadow: `inset 0 0 0 ${checked ? 'var(--bento-border-width-strong)' : 'var(--bento-border-width)'} ${line}`
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 'var(--bento-radius-full)',
      background: disabled ? 'var(--bento-action-disabled-fg)' : 'var(--bento-bg-interactive)'
    }
  })), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
      color: disabled ? 'var(--bento-content-disabled)' : 'var(--bento-content-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { RadioButton, __ds_default_components_forms_RadioButton_m2ggyj: RadioButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Slider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Slider({
  min = 0,
  max = 100,
  value = 50,
  step = 1,
  showValue = true,
  showTicks = false,
  state = 'enabled',
  width = 320,
  onChange,
  style,
  ...rest
}) {
  const disabled = state === 'disabled';
  const pct = Math.max(0, Math.min(100, (value - min) / (max - min) * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      width,
      ...style
    }
  }, rest), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-medium) 14px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)',
      minWidth: 24,
      textAlign: 'right'
    }
  }, min), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      minWidth: 0,
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 'var(--bento-radius-4)',
      background: 'var(--bento-border-container)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: disabled ? 'var(--bento-action-disabled-bg)' : 'var(--bento-bg-interactive)'
    }
  })), showTicks && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '8px 0',
      display: 'flex',
      justifyContent: 'space-between',
      pointerEvents: 'none'
    }
  }, Array.from({
    length: 5
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 1,
      height: 8,
      background: 'var(--bento-border-decorative)'
    }
  }))), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    step: step,
    value: value,
    disabled: disabled,
    onChange: e => onChange && onChange(Number(e.target.value)),
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      opacity: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      margin: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 4,
      left: `calc(${pct}% - 12px)`,
      width: 24,
      height: 24,
      borderRadius: 'var(--bento-radius-8)',
      background: 'var(--bento-neutral-1)',
      boxShadow: `inset 0 0 0 var(--bento-border-width) ${disabled ? 'var(--bento-border-input-disabled)' : 'var(--bento-border-input-hover)'}`,
      pointerEvents: 'none'
    }
  })), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-medium) 14px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)',
      minWidth: 24
    }
  }, max));
}
Object.assign(__ds_scope, { Slider, __ds_default_components_forms_Slider_k8j26r: Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  label,
  checked = false,
  state = 'enabled',
  onChange,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const disabled = state === 'disabled';
  return /*#__PURE__*/React.createElement("label", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: 'inline-flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      width: 'fit-content',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      width: 42,
      height: 24,
      padding: 3,
      boxSizing: 'border-box',
      borderRadius: 'var(--bento-radius-12)',
      background: checked ? disabled ? 'var(--bento-action-disabled-bg)' : 'var(--bento-bg-interactive)' : disabled ? 'var(--bento-bg-secondary)' : 'var(--bento-bg-primary)',
      boxShadow: checked ? 'none' : `inset 0 0 0 var(--bento-border-width) ${disabled ? 'var(--bento-border-input-disabled)' : hover ? 'var(--bento-border-input-hover)' : 'var(--bento-border-input-enabled)'}`,
      justifyContent: checked ? 'flex-end' : 'flex-start',
      transition: 'background-color 120ms ease'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 'var(--bento-radius-full)',
      background: checked ? 'var(--bento-white)' : disabled ? 'var(--bento-border-input-disabled)' : 'var(--bento-neutral-70)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 16px/20px var(--bento-font-ui)',
      color: disabled ? 'var(--bento-content-disabled)' : 'var(--bento-content-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch, __ds_default_components_forms_Switch_kgb19e: Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/icons/icon-data.js
try { (() => {
// Generated by fig_materialize (moduleFormat: 'icon-data') — 141 icon(s)
// as { viewBox, body } SVG-markup entries. Render via the sibling Icon.jsx
// (<Icon name="BellWeightBold" />), or consume the path data directly.
let __ds_default_components_icons_icon_data_12stud1;
try {
  __ds_default_components_icons_icon_data_12stud1 = {
    "BellWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24.66 18.241 C 23.575 16.375 22.999 13.696 22.999 10.5 C 22.999 7.715 21.893 5.045 19.924 3.075 C 17.955 1.106 15.284 0 12.499 0 C 9.714 0 7.044 1.106 5.074 3.075 C 3.105 5.045 1.999 7.715 1.999 10.5 C 1.999 13.698 1.425 16.375 0.34 18.241 C 0.119 18.622 0.002 19.054 0 19.494 C -0.002 19.935 0.113 20.368 0.332 20.75 C 0.549 21.132 0.864 21.45 1.245 21.67 C 1.626 21.889 2.059 22.003 2.499 22 L 7.022 22 C 7.146 23.367 7.776 24.638 8.79 25.564 C 9.803 26.49 11.126 27.003 12.499 27.003 C 13.872 27.003 15.195 26.49 16.208 25.564 C 17.222 24.638 17.853 23.367 17.977 22 L 22.499 22 C 22.938 22.003 23.37 21.888 23.751 21.669 C 24.131 21.449 24.446 21.132 24.663 20.75 C 24.882 20.368 24.998 19.936 24.997 19.495 C 24.997 19.055 24.881 18.622 24.66 18.241 Z M 12.499 24 C 11.923 24 11.364 23.801 10.918 23.437 C 10.471 23.072 10.164 22.565 10.049 22 L 14.949 22 C 14.834 22.565 14.527 23.072 14.081 23.437 C 13.634 23.801 13.075 24 12.499 24 Z M 3.332 19 C 4.438 16.75 4.999 13.892 4.999 10.5 C 4.999 8.511 5.789 6.603 7.196 5.197 C 8.602 3.79 10.51 3 12.499 3 C 14.488 3 16.396 3.79 17.802 5.197 C 19.209 6.603 19.999 8.511 19.999 10.5 C 19.999 13.891 20.559 16.75 21.665 19 L 3.332 19 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.501 2.500)\"/>"
    },
    "BellWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 20.994 20 L 0.994 20 C 0.819 19.999 0.647 19.952 0.496 19.864 C 0.345 19.776 0.22 19.649 0.132 19.497 C 0.045 19.346 0 19.174 0 18.998 C 0 18.823 0.046 18.652 0.134 18.5 C 0.958 17.075 1.994 13.476 1.994 9 C 1.994 6.613 2.942 4.324 4.63 2.636 C 6.318 0.948 8.607 0 10.994 0 C 13.381 0 15.67 0.948 17.358 2.636 C 19.046 4.324 19.994 6.613 19.994 9 C 19.994 13.477 21.031 17.075 21.856 18.5 C 21.944 18.652 21.99 18.824 21.99 18.999 C 21.991 19.174 21.945 19.347 21.857 19.498 C 21.77 19.65 21.644 19.777 21.493 19.865 C 21.341 19.953 21.169 19.999 20.994 20 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.006 4)\"/><path d=\"M 23.724 18.993 C 23.03 17.798 21.999 14.416 21.999 10 C 21.999 7.348 20.945 4.804 19.07 2.929 C 17.194 1.054 14.651 0 11.999 0 C 9.346 0 6.803 1.054 4.927 2.929 C 3.052 4.804 1.999 7.348 1.999 10 C 1.999 14.417 0.966 17.798 0.272 18.993 C 0.095 19.296 0.001 19.641 0 19.993 C -0.001 20.345 0.09 20.691 0.265 20.996 C 0.44 21.301 0.693 21.554 0.997 21.73 C 1.301 21.907 1.647 22 1.999 22 L 7.1 22 C 7.331 23.129 7.944 24.144 8.837 24.872 C 9.729 25.601 10.846 25.999 11.999 25.999 C 13.151 25.999 14.268 25.601 15.16 24.872 C 16.053 24.144 16.667 23.129 16.897 22 L 21.999 22 C 22.35 22 22.695 21.906 22.999 21.73 C 23.304 21.554 23.556 21.3 23.731 20.995 C 23.906 20.69 23.997 20.344 23.996 19.993 C 23.995 19.641 23.901 19.296 23.724 18.993 Z M 11.999 24 C 11.378 24 10.773 23.807 10.267 23.449 C 9.761 23.091 9.378 22.585 9.171 22 L 14.826 22 C 14.619 22.585 14.236 23.091 13.73 23.449 C 13.224 23.807 12.619 24 11.999 24 Z M 1.999 20 C 2.961 18.345 3.999 14.51 3.999 10 C 3.999 7.878 4.841 5.843 6.342 4.343 C 7.842 2.843 9.877 2 11.999 2 C 14.12 2 16.155 2.843 17.655 4.343 C 19.156 5.843 19.999 7.878 19.999 10 C 19.999 14.506 21.034 18.341 21.999 20 L 1.999 20 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.001 3)\"/>"
    },
    "BellWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.724 18.993 C 23.03 17.798 21.999 14.416 21.999 10 C 21.999 7.348 20.945 4.804 19.07 2.929 C 17.194 1.054 14.651 0 11.999 0 C 9.346 0 6.803 1.054 4.927 2.929 C 3.052 4.804 1.999 7.348 1.999 10 C 1.999 14.417 0.966 17.798 0.272 18.993 C 0.095 19.296 0.001 19.641 0 19.993 C -0.001 20.345 0.09 20.691 0.265 20.996 C 0.44 21.301 0.693 21.554 0.997 21.73 C 1.301 21.907 1.647 22 1.999 22 L 7.1 22 C 7.331 23.129 7.944 24.144 8.837 24.872 C 9.729 25.601 10.846 25.999 11.999 25.999 C 13.151 25.999 14.268 25.601 15.16 24.872 C 16.053 24.144 16.667 23.129 16.897 22 L 21.999 22 C 22.35 22 22.695 21.906 22.999 21.73 C 23.304 21.554 23.556 21.3 23.731 20.995 C 23.906 20.69 23.997 20.344 23.996 19.993 C 23.995 19.641 23.901 19.296 23.724 18.993 Z M 11.999 24 C 11.378 24 10.773 23.807 10.267 23.449 C 9.761 23.091 9.378 22.585 9.171 22 L 14.826 22 C 14.619 22.585 14.236 23.091 13.73 23.449 C 13.224 23.807 12.619 24 11.999 24 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.001 3)\"/>"
    },
    "BellWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.258 18.868 C 22.55 17.65 21.499 14.216 21.499 9.75 C 21.499 7.164 20.472 4.684 18.643 2.856 C 16.815 1.027 14.335 0 11.749 0 C 9.163 0 6.683 1.027 4.855 2.856 C 3.026 4.684 1.999 7.164 1.999 9.75 C 1.999 14.218 0.946 17.65 0.239 18.868 C 0.084 19.133 0.001 19.435 0 19.743 C -0.001 20.051 0.079 20.354 0.232 20.621 C 0.385 20.888 0.606 21.11 0.872 21.264 C 1.139 21.418 1.441 21.5 1.749 21.5 L 7.059 21.5 C 7.241 22.612 7.812 23.623 8.671 24.352 C 9.53 25.082 10.62 25.482 11.746 25.482 C 12.873 25.482 13.963 25.082 14.822 24.352 C 15.68 23.623 16.252 22.612 16.434 21.5 L 21.749 21.5 C 22.056 21.499 22.358 21.418 22.624 21.263 C 22.89 21.109 23.111 20.887 23.264 20.62 C 23.417 20.353 23.496 20.05 23.495 19.743 C 23.494 19.435 23.411 19.133 23.256 18.868 L 23.258 18.868 Z M 11.749 24 C 11.017 24 10.308 23.753 9.734 23.299 C 9.16 22.846 8.756 22.212 8.588 21.5 L 14.91 21.5 C 14.741 22.212 14.337 22.846 13.764 23.299 C 13.19 23.753 12.48 24 11.749 24 Z M 21.963 19.875 C 21.942 19.913 21.911 19.945 21.874 19.967 C 21.836 19.989 21.794 20.001 21.75 20 L 1.749 20 C 1.705 20.001 1.663 19.989 1.625 19.967 C 1.588 19.945 1.557 19.913 1.536 19.875 C 1.514 19.837 1.503 19.794 1.503 19.75 C 1.503 19.706 1.514 19.663 1.536 19.625 C 2.483 18 3.499 14.211 3.499 9.75 C 3.499 7.562 4.368 5.464 5.915 3.916 C 7.462 2.369 9.561 1.5 11.749 1.5 C 13.937 1.5 16.035 2.369 17.582 3.916 C 19.13 5.464 19.999 7.562 19.999 9.75 C 19.999 14.21 21.016 17.994 21.963 19.625 C 21.985 19.663 21.996 19.706 21.996 19.75 C 21.996 19.794 21.985 19.837 21.963 19.875 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.251 3.250)\"/>"
    },
    "BellWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.724 18.993 C 23.03 17.798 21.999 14.416 21.999 10 C 21.999 7.348 20.945 4.804 19.07 2.929 C 17.194 1.054 14.651 0 11.999 0 C 9.346 0 6.803 1.054 4.927 2.929 C 3.052 4.804 1.999 7.348 1.999 10 C 1.999 14.417 0.966 17.798 0.272 18.993 C 0.095 19.296 0.001 19.641 0 19.993 C -0.001 20.345 0.09 20.691 0.265 20.996 C 0.44 21.301 0.693 21.554 0.997 21.73 C 1.301 21.907 1.647 22 1.999 22 L 7.1 22 C 7.331 23.129 7.944 24.144 8.837 24.872 C 9.729 25.601 10.846 25.999 11.999 25.999 C 13.151 25.999 14.268 25.601 15.16 24.872 C 16.053 24.144 16.667 23.129 16.897 22 L 21.999 22 C 22.35 22 22.695 21.906 22.999 21.73 C 23.304 21.554 23.556 21.3 23.731 20.995 C 23.906 20.69 23.997 20.344 23.996 19.993 C 23.995 19.641 23.901 19.296 23.724 18.993 Z M 11.999 24 C 11.378 24 10.773 23.807 10.267 23.449 C 9.761 23.091 9.378 22.585 9.171 22 L 14.826 22 C 14.619 22.585 14.236 23.091 13.73 23.449 C 13.224 23.807 12.619 24 11.999 24 Z M 1.999 20 C 2.961 18.345 3.999 14.51 3.999 10 C 3.999 7.878 4.841 5.843 6.342 4.343 C 7.842 2.843 9.877 2 11.999 2 C 14.12 2 16.155 2.843 17.655 4.343 C 19.156 5.843 19.999 7.878 19.999 10 C 19.999 14.506 21.034 18.341 21.999 20 L 1.999 20 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.001 3)\"/>"
    },
    "BellWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22.793 18.75 C 22.072 17.5 21 14.016 21 9.5 C 21 6.98 19.999 4.564 18.217 2.782 C 16.436 1.001 14.019 0 11.5 0 C 8.98 0 6.564 1.001 4.782 2.782 C 3 4.564 2 6.98 2 9.5 C 2 14.016 0.926 17.5 0.205 18.744 C 0.072 18.972 0.001 19.231 0 19.494 C -0.001 19.758 0.068 20.018 0.199 20.247 C 0.33 20.476 0.52 20.666 0.748 20.798 C 0.977 20.93 1.236 21 1.5 21 L 7.028 21 C 7.153 22.098 7.678 23.113 8.503 23.849 C 9.327 24.585 10.394 24.992 11.5 24.992 C 12.605 24.992 13.672 24.585 14.497 23.849 C 15.321 23.113 15.846 22.098 15.971 21 L 21.5 21 C 21.762 20.999 22.02 20.929 22.248 20.797 C 22.475 20.665 22.664 20.476 22.795 20.248 C 22.926 20.02 22.995 19.762 22.994 19.499 C 22.994 19.236 22.925 18.978 22.793 18.75 Z M 11.5 24 C 10.658 24 9.845 23.697 9.209 23.146 C 8.572 22.595 8.156 21.833 8.036 21 L 14.963 21 C 14.843 21.833 14.427 22.595 13.791 23.146 C 13.155 23.697 12.341 24 11.5 24 Z M 21.931 19.75 C 21.888 19.826 21.826 19.89 21.75 19.934 C 21.674 19.978 21.588 20.001 21.501 20 L 1.5 20 C 1.412 20.001 1.326 19.978 1.25 19.934 C 1.175 19.89 1.112 19.826 1.07 19.75 C 1.026 19.674 1.003 19.588 1.003 19.5 C 1.003 19.412 1.026 19.326 1.07 19.25 C 2 17.646 3 13.915 3 9.5 C 3 7.246 3.895 5.084 5.489 3.49 C 7.083 1.896 9.245 1 11.5 1 C 13.754 1 15.916 1.896 17.51 3.49 C 19.104 5.084 20 7.246 20 9.5 C 20 13.914 21 17.646 21.93 19.25 C 21.974 19.326 21.997 19.412 21.997 19.5 C 21.997 19.588 21.975 19.674 21.931 19.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 3.500)\"/>"
    },
    "Bin": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 17.25 3 L 13.5 3 L 13.5 2.25 C 13.5 1.653 13.263 1.081 12.841 0.659 C 12.419 0.237 11.847 0 11.25 0 L 6.75 0 C 6.153 0 5.581 0.237 5.159 0.659 C 4.737 1.081 4.5 1.653 4.5 2.25 L 4.5 3 L 0.75 3 C 0.551 3 0.36 3.079 0.22 3.22 C 0.079 3.36 0 3.551 0 3.75 C 0 3.949 0.079 4.14 0.22 4.28 C 0.36 4.421 0.551 4.5 0.75 4.5 L 1.5 4.5 L 1.5 18 C 1.5 18.398 1.658 18.779 1.939 19.061 C 2.221 19.342 2.602 19.5 3 19.5 L 15 19.5 C 15.398 19.5 15.779 19.342 16.061 19.061 C 16.342 18.779 16.5 18.398 16.5 18 L 16.5 4.5 L 17.25 4.5 C 17.449 4.5 17.64 4.421 17.78 4.28 C 17.921 4.14 18 3.949 18 3.75 C 18 3.551 17.921 3.36 17.78 3.22 C 17.64 3.079 17.449 3 17.25 3 Z M 6 2.25 C 6 2.051 6.079 1.86 6.22 1.72 C 6.36 1.579 6.551 1.5 6.75 1.5 L 11.25 1.5 C 11.449 1.5 11.64 1.579 11.78 1.72 C 11.921 1.86 12 2.051 12 2.25 L 12 3 L 6 3 L 6 2.25 Z M 15 18 L 3 18 L 3 4.5 L 15 4.5 L 15 18 Z M 7.5 8.25 L 7.5 14.25 C 7.5 14.449 7.421 14.64 7.28 14.78 C 7.14 14.921 6.949 15 6.75 15 C 6.551 15 6.36 14.921 6.22 14.78 C 6.079 14.64 6 14.449 6 14.25 L 6 8.25 C 6 8.051 6.079 7.86 6.22 7.72 C 6.36 7.579 6.551 7.5 6.75 7.5 C 6.949 7.5 7.14 7.579 7.28 7.72 C 7.421 7.86 7.5 8.051 7.5 8.25 Z M 12 8.25 L 12 14.25 C 12 14.449 11.921 14.64 11.78 14.78 C 11.64 14.921 11.449 15 11.25 15 C 11.051 15 10.86 14.921 10.72 14.78 C 10.579 14.64 10.5 14.449 10.5 14.25 L 10.5 8.25 C 10.5 8.051 10.579 7.86 10.72 7.72 C 10.86 7.579 11.051 7.5 11.25 7.5 C 11.449 7.5 11.64 7.579 11.78 7.72 C 11.921 7.86 12 8.051 12 8.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 1.500)\"/>"
    },
    "CalendarWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22.5 2 L 20 2 L 20 1.5 C 20 1.102 19.842 0.721 19.561 0.439 C 19.279 0.158 18.898 0 18.5 0 C 18.102 0 17.721 0.158 17.439 0.439 C 17.158 0.721 17 1.102 17 1.5 L 17 2 L 8 2 L 8 1.5 C 8 1.102 7.842 0.721 7.561 0.439 C 7.279 0.158 6.898 0 6.5 0 C 6.102 0 5.721 0.158 5.439 0.439 C 5.158 0.721 5 1.102 5 1.5 L 5 2 L 2.5 2 C 1.837 2 1.201 2.263 0.732 2.732 C 0.263 3.201 0 3.837 0 4.5 L 0 24.5 C 0 25.163 0.263 25.799 0.732 26.268 C 1.201 26.737 1.837 27 2.5 27 L 22.5 27 C 23.163 27 23.799 26.737 24.268 26.268 C 24.737 25.799 25 25.163 25 24.5 L 25 4.5 C 25 3.837 24.737 3.201 24.268 2.732 C 23.799 2.263 23.163 2 22.5 2 Z M 5 5 C 5 5.398 5.158 5.779 5.439 6.061 C 5.721 6.342 6.102 6.5 6.5 6.5 C 6.898 6.5 7.279 6.342 7.561 6.061 C 7.842 5.779 8 5.398 8 5 L 17 5 C 17 5.398 17.158 5.779 17.439 6.061 C 17.721 6.342 18.102 6.5 18.5 6.5 C 18.898 6.5 19.279 6.342 19.561 6.061 C 19.842 5.779 20 5.398 20 5 L 22 5 L 22 8 L 3 8 L 3 5 L 5 5 Z M 3 24 L 3 11 L 22 11 L 22 24 L 3 24 Z M 10.5 14 L 10.5 21 C 10.5 21.398 10.342 21.779 10.061 22.061 C 9.779 22.342 9.398 22.5 9 22.5 C 8.602 22.5 8.221 22.342 7.939 22.061 C 7.658 21.779 7.5 21.398 7.5 21 L 7.5 16.415 C 7.143 16.532 6.755 16.511 6.413 16.356 C 6.071 16.201 5.799 15.923 5.652 15.578 C 5.505 15.232 5.493 14.844 5.618 14.49 C 5.743 14.135 5.997 13.841 6.329 13.665 L 8.329 12.665 C 8.557 12.551 8.811 12.497 9.065 12.508 C 9.32 12.519 9.568 12.595 9.786 12.729 C 10.003 12.862 10.183 13.049 10.308 13.272 C 10.433 13.494 10.499 13.745 10.5 14 Z M 18.186 18.235 L 16.987 19.5 L 17.5 19.5 C 17.898 19.5 18.279 19.658 18.561 19.939 C 18.842 20.221 19 20.602 19 21 C 19 21.398 18.842 21.779 18.561 22.061 C 18.279 22.342 17.898 22.5 17.5 22.5 L 13.5 22.5 C 13.207 22.5 12.92 22.414 12.675 22.253 C 12.431 22.091 12.238 21.862 12.123 21.593 C 12.007 21.323 11.972 21.026 12.024 20.737 C 12.075 20.449 12.21 20.182 12.411 19.969 L 15.931 16.25 C 15.976 16.174 15.999 16.088 16 16 C 16 15.89 15.964 15.782 15.897 15.695 C 15.83 15.607 15.736 15.544 15.629 15.516 C 15.523 15.487 15.41 15.495 15.308 15.537 C 15.206 15.579 15.121 15.654 15.066 15.75 C 14.863 16.087 14.537 16.33 14.156 16.429 C 13.775 16.527 13.371 16.472 13.031 16.275 C 12.691 16.079 12.441 15.756 12.336 15.378 C 12.231 14.999 12.278 14.594 12.469 14.25 C 12.854 13.583 13.449 13.061 14.16 12.766 C 14.872 12.471 15.662 12.42 16.406 12.619 C 17.15 12.818 17.808 13.258 18.277 13.869 C 18.746 14.48 19 15.229 19 16 C 19.002 16.761 18.755 17.501 18.295 18.108 C 18.261 18.152 18.225 18.195 18.186 18.235 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 1.500)\"/>"
    },
    "CalendarWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 1 L 22 6 L 0 6 L 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 21 0 C 21.265 0 21.52 0.105 21.707 0.293 C 21.895 0.48 22 0.735 22 1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 5)\"/><path d=\"M 22 2 L 19 2 L 19 1 C 19 0.735 18.895 0.48 18.707 0.293 C 18.52 0.105 18.265 0 18 0 C 17.735 0 17.48 0.105 17.293 0.293 C 17.105 0.48 17 0.735 17 1 L 17 2 L 7 2 L 7 1 C 7 0.735 6.895 0.48 6.707 0.293 C 6.52 0.105 6.265 0 6 0 C 5.735 0 5.48 0.105 5.293 0.293 C 5.105 0.48 5 0.735 5 1 L 5 2 L 2 2 C 1.47 2 0.961 2.211 0.586 2.586 C 0.211 2.961 0 3.47 0 4 L 0 24 C 0 24.53 0.211 25.039 0.586 25.414 C 0.961 25.789 1.47 26 2 26 L 22 26 C 22.53 26 23.039 25.789 23.414 25.414 C 23.789 25.039 24 24.53 24 24 L 24 4 C 24 3.47 23.789 2.961 23.414 2.586 C 23.039 2.211 22.53 2 22 2 Z M 5 4 L 5 5 C 5 5.265 5.105 5.52 5.293 5.707 C 5.48 5.895 5.735 6 6 6 C 6.265 6 6.52 5.895 6.707 5.707 C 6.895 5.52 7 5.265 7 5 L 7 4 L 17 4 L 17 5 C 17 5.265 17.105 5.52 17.293 5.707 C 17.48 5.895 17.735 6 18 6 C 18.265 6 18.52 5.895 18.707 5.707 C 18.895 5.52 19 5.265 19 5 L 19 4 L 22 4 L 22 8 L 2 8 L 2 4 L 5 4 Z M 22 24 L 2 24 L 2 10 L 22 10 L 22 24 Z M 10 13 L 10 21 C 10 21.265 9.895 21.52 9.707 21.707 C 9.52 21.895 9.265 22 9 22 C 8.735 22 8.48 21.895 8.293 21.707 C 8.105 21.52 8 21.265 8 21 L 8 14.618 L 7.448 14.895 C 7.21 15.014 6.935 15.033 6.684 14.949 C 6.432 14.865 6.224 14.685 6.105 14.448 C 5.986 14.21 5.967 13.935 6.051 13.684 C 6.135 13.432 6.315 13.224 6.552 13.105 L 8.552 12.105 C 8.705 12.029 8.875 11.993 9.045 12 C 9.215 12.008 9.381 12.059 9.526 12.149 C 9.671 12.238 9.791 12.364 9.874 12.513 C 9.957 12.662 10 12.829 10 13 Z M 17.395 16.806 L 15 20 L 17 20 C 17.265 20 17.52 20.105 17.707 20.293 C 17.895 20.48 18 20.735 18 21 C 18 21.265 17.895 21.52 17.707 21.707 C 17.52 21.895 17.265 22 17 22 L 13 22 C 12.814 22 12.632 21.948 12.474 21.851 C 12.316 21.753 12.189 21.613 12.106 21.447 C 12.023 21.281 11.987 21.095 12.004 20.91 C 12.021 20.725 12.089 20.549 12.2 20.4 L 15.798 15.604 C 15.879 15.495 15.938 15.37 15.97 15.238 C 16.002 15.105 16.007 14.968 15.983 14.834 C 15.96 14.699 15.91 14.571 15.836 14.457 C 15.761 14.343 15.664 14.245 15.551 14.17 C 15.437 14.095 15.31 14.043 15.175 14.019 C 15.041 13.995 14.904 13.998 14.771 14.029 C 14.638 14.06 14.513 14.118 14.404 14.199 C 14.294 14.28 14.202 14.382 14.134 14.5 C 14.07 14.617 13.983 14.721 13.879 14.804 C 13.775 14.887 13.655 14.949 13.526 14.985 C 13.398 15.022 13.263 15.032 13.131 15.015 C 12.998 14.998 12.87 14.956 12.755 14.889 C 12.639 14.822 12.538 14.733 12.457 14.626 C 12.377 14.52 12.318 14.398 12.286 14.269 C 12.253 14.139 12.246 14.005 12.266 13.873 C 12.286 13.74 12.333 13.614 12.403 13.5 C 12.733 12.928 13.243 12.482 13.853 12.229 C 14.463 11.977 15.139 11.932 15.777 12.103 C 16.414 12.274 16.978 12.651 17.38 13.174 C 17.782 13.698 18 14.34 18 15 C 18.002 15.652 17.79 16.287 17.395 16.806 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 2)\"/>"
    },
    "CalendarWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 2 L 19 2 L 19 1 C 19 0.735 18.895 0.48 18.707 0.293 C 18.52 0.105 18.265 0 18 0 C 17.735 0 17.48 0.105 17.293 0.293 C 17.105 0.48 17 0.735 17 1 L 17 2 L 7 2 L 7 1 C 7 0.735 6.895 0.48 6.707 0.293 C 6.52 0.105 6.265 0 6 0 C 5.735 0 5.48 0.105 5.293 0.293 C 5.105 0.48 5 0.735 5 1 L 5 2 L 2 2 C 1.47 2 0.961 2.211 0.586 2.586 C 0.211 2.961 0 3.47 0 4 L 0 24 C 0 24.53 0.211 25.039 0.586 25.414 C 0.961 25.789 1.47 26 2 26 L 22 26 C 22.53 26 23.039 25.789 23.414 25.414 C 23.789 25.039 24 24.53 24 24 L 24 4 C 24 3.47 23.789 2.961 23.414 2.586 C 23.039 2.211 22.53 2 22 2 Z M 10 21 C 10 21.265 9.895 21.52 9.707 21.707 C 9.52 21.895 9.265 22 9 22 C 8.735 22 8.48 21.895 8.293 21.707 C 8.105 21.52 8 21.265 8 21 L 8 14.618 L 7.448 14.895 C 7.21 15.014 6.935 15.033 6.684 14.949 C 6.432 14.865 6.224 14.685 6.105 14.448 C 5.986 14.21 5.967 13.935 6.051 13.684 C 6.135 13.432 6.315 13.224 6.552 13.105 L 8.552 12.105 C 8.705 12.029 8.875 11.993 9.045 12 C 9.215 12.008 9.381 12.059 9.526 12.149 C 9.671 12.238 9.791 12.364 9.874 12.513 C 9.957 12.662 10 12.829 10 13 L 10 21 Z M 17 20 C 17.265 20 17.52 20.105 17.707 20.293 C 17.895 20.48 18 20.735 18 21 C 18 21.265 17.895 21.52 17.707 21.707 C 17.52 21.895 17.265 22 17 22 L 13 22 C 12.814 22 12.632 21.948 12.474 21.851 C 12.316 21.753 12.189 21.613 12.106 21.447 C 12.023 21.281 11.987 21.095 12.004 20.91 C 12.021 20.725 12.089 20.549 12.2 20.4 L 15.798 15.604 C 15.879 15.495 15.938 15.37 15.97 15.238 C 16.002 15.105 16.007 14.968 15.983 14.834 C 15.96 14.699 15.91 14.571 15.836 14.457 C 15.761 14.343 15.664 14.245 15.551 14.17 C 15.437 14.095 15.31 14.043 15.175 14.019 C 15.041 13.995 14.904 13.998 14.771 14.029 C 14.638 14.06 14.513 14.118 14.404 14.199 C 14.294 14.28 14.202 14.382 14.134 14.5 C 14.07 14.617 13.983 14.721 13.879 14.804 C 13.775 14.887 13.655 14.949 13.526 14.985 C 13.398 15.022 13.263 15.032 13.131 15.015 C 12.998 14.998 12.87 14.956 12.755 14.889 C 12.639 14.822 12.538 14.733 12.457 14.626 C 12.377 14.52 12.318 14.398 12.286 14.269 C 12.253 14.139 12.246 14.005 12.266 13.873 C 12.286 13.74 12.333 13.614 12.403 13.5 C 12.733 12.928 13.243 12.482 13.853 12.229 C 14.463 11.977 15.139 11.932 15.777 12.103 C 16.414 12.274 16.978 12.651 17.38 13.174 C 17.782 13.698 18 14.34 18 15 C 18.002 15.652 17.79 16.287 17.395 16.806 L 15 20 L 17 20 Z M 2 8 L 2 4 L 5 4 L 5 5 C 5 5.265 5.105 5.52 5.293 5.707 C 5.48 5.895 5.735 6 6 6 C 6.265 6 6.52 5.895 6.707 5.707 C 6.895 5.52 7 5.265 7 5 L 7 4 L 17 4 L 17 5 C 17 5.265 17.105 5.52 17.293 5.707 C 17.48 5.895 17.735 6 18 6 C 18.265 6 18.52 5.895 18.707 5.707 C 18.895 5.52 19 5.265 19 5 L 19 4 L 22 4 L 22 8 L 2 8 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 2)\"/>"
    },
    "CalendarWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 21.75 2 L 18.5 2 L 18.5 0.75 C 18.5 0.551 18.421 0.36 18.28 0.22 C 18.14 0.079 17.949 0 17.75 0 C 17.551 0 17.36 0.079 17.22 0.22 C 17.079 0.36 17 0.551 17 0.75 L 17 2 L 6.5 2 L 6.5 0.75 C 6.5 0.551 6.421 0.36 6.28 0.22 C 6.14 0.079 5.949 0 5.75 0 C 5.551 0 5.36 0.079 5.22 0.22 C 5.079 0.36 5 0.551 5 0.75 L 5 2 L 1.75 2 C 1.286 2 0.841 2.184 0.513 2.513 C 0.184 2.841 0 3.286 0 3.75 L 0 23.75 C 0 24.214 0.184 24.659 0.513 24.987 C 0.841 25.316 1.286 25.5 1.75 25.5 L 21.75 25.5 C 22.214 25.5 22.659 25.316 22.987 24.987 C 23.316 24.659 23.5 24.214 23.5 23.75 L 23.5 3.75 C 23.5 3.286 23.316 2.841 22.987 2.513 C 22.659 2.184 22.214 2 21.75 2 Z M 1.75 3.5 L 5 3.5 L 5 4.75 C 5 4.949 5.079 5.14 5.22 5.28 C 5.36 5.421 5.551 5.5 5.75 5.5 C 5.949 5.5 6.14 5.421 6.28 5.28 C 6.421 5.14 6.5 4.949 6.5 4.75 L 6.5 3.5 L 17 3.5 L 17 4.75 C 17 4.949 17.079 5.14 17.22 5.28 C 17.36 5.421 17.551 5.5 17.75 5.5 C 17.949 5.5 18.14 5.421 18.28 5.28 C 18.421 5.14 18.5 4.949 18.5 4.75 L 18.5 3.5 L 21.75 3.5 C 21.816 3.5 21.88 3.526 21.927 3.573 C 21.974 3.62 22 3.684 22 3.75 L 22 8 L 1.5 8 L 1.5 3.75 C 1.5 3.684 1.526 3.62 1.573 3.573 C 1.62 3.526 1.684 3.5 1.75 3.5 Z M 21.75 24 L 1.75 24 C 1.684 24 1.62 23.974 1.573 23.927 C 1.526 23.88 1.5 23.816 1.5 23.75 L 1.5 9.5 L 22 9.5 L 22 23.75 C 22 23.816 21.974 23.88 21.927 23.927 C 21.88 23.974 21.816 24 21.75 24 Z M 9.5 12.75 L 9.5 20.75 C 9.5 20.949 9.421 21.14 9.28 21.28 C 9.14 21.421 8.949 21.5 8.75 21.5 C 8.551 21.5 8.36 21.421 8.22 21.28 C 8.079 21.14 8 20.949 8 20.75 L 8 13.964 L 7.085 14.421 C 6.997 14.465 6.901 14.491 6.803 14.498 C 6.704 14.505 6.606 14.493 6.512 14.462 C 6.419 14.43 6.332 14.381 6.258 14.316 C 6.184 14.252 6.123 14.173 6.079 14.085 C 6.035 13.997 6.009 13.901 6.002 13.803 C 5.995 13.704 6.007 13.606 6.038 13.512 C 6.07 13.419 6.119 13.332 6.184 13.258 C 6.248 13.184 6.327 13.123 6.415 13.079 L 8.415 12.079 C 8.529 12.022 8.656 11.995 8.784 12.001 C 8.912 12.006 9.036 12.045 9.145 12.112 C 9.253 12.179 9.343 12.273 9.405 12.385 C 9.467 12.496 9.5 12.622 9.5 12.75 Z M 16.946 16.406 L 14.25 20 L 16.75 20 C 16.949 20 17.14 20.079 17.28 20.22 C 17.421 20.36 17.5 20.551 17.5 20.75 C 17.5 20.949 17.421 21.14 17.28 21.28 C 17.14 21.421 16.949 21.5 16.75 21.5 L 12.75 21.5 C 12.611 21.5 12.474 21.461 12.356 21.388 C 12.237 21.315 12.141 21.21 12.079 21.085 C 12.017 20.961 11.991 20.821 12.003 20.683 C 12.016 20.544 12.066 20.411 12.15 20.3 L 15.75 15.5 C 15.854 15.364 15.928 15.208 15.969 15.042 C 16.01 14.875 16.016 14.702 15.988 14.534 C 15.959 14.365 15.896 14.204 15.803 14.06 C 15.709 13.917 15.587 13.794 15.444 13.7 C 15.302 13.606 15.141 13.542 14.972 13.512 C 14.804 13.482 14.631 13.487 14.464 13.527 C 14.298 13.567 14.141 13.641 14.005 13.744 C 13.868 13.846 13.753 13.976 13.669 14.125 C 13.624 14.218 13.56 14.301 13.482 14.369 C 13.404 14.436 13.312 14.487 13.214 14.517 C 13.115 14.548 13.011 14.558 12.908 14.546 C 12.805 14.534 12.706 14.501 12.616 14.45 C 12.527 14.398 12.449 14.328 12.388 14.244 C 12.327 14.161 12.283 14.066 12.261 13.965 C 12.238 13.864 12.237 13.76 12.256 13.658 C 12.276 13.557 12.316 13.46 12.375 13.375 C 12.563 13.051 12.816 12.77 13.117 12.547 C 13.418 12.325 13.762 12.166 14.127 12.081 C 14.491 11.996 14.87 11.986 15.238 12.053 C 15.607 12.119 15.958 12.26 16.27 12.467 C 16.582 12.673 16.849 12.942 17.054 13.255 C 17.258 13.569 17.397 13.921 17.461 14.29 C 17.525 14.659 17.513 15.037 17.425 15.401 C 17.338 15.765 17.177 16.108 16.952 16.407 L 16.946 16.406 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.250 2.250)\"/>"
    },
    "CalendarWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 2 L 19 2 L 19 1 C 19 0.735 18.895 0.48 18.707 0.293 C 18.52 0.105 18.265 0 18 0 C 17.735 0 17.48 0.105 17.293 0.293 C 17.105 0.48 17 0.735 17 1 L 17 2 L 7 2 L 7 1 C 7 0.735 6.895 0.48 6.707 0.293 C 6.52 0.105 6.265 0 6 0 C 5.735 0 5.48 0.105 5.293 0.293 C 5.105 0.48 5 0.735 5 1 L 5 2 L 2 2 C 1.47 2 0.961 2.211 0.586 2.586 C 0.211 2.961 0 3.47 0 4 L 0 24 C 0 24.53 0.211 25.039 0.586 25.414 C 0.961 25.789 1.47 26 2 26 L 22 26 C 22.53 26 23.039 25.789 23.414 25.414 C 23.789 25.039 24 24.53 24 24 L 24 4 C 24 3.47 23.789 2.961 23.414 2.586 C 23.039 2.211 22.53 2 22 2 Z M 5 4 L 5 5 C 5 5.265 5.105 5.52 5.293 5.707 C 5.48 5.895 5.735 6 6 6 C 6.265 6 6.52 5.895 6.707 5.707 C 6.895 5.52 7 5.265 7 5 L 7 4 L 17 4 L 17 5 C 17 5.265 17.105 5.52 17.293 5.707 C 17.48 5.895 17.735 6 18 6 C 18.265 6 18.52 5.895 18.707 5.707 C 18.895 5.52 19 5.265 19 5 L 19 4 L 22 4 L 22 8 L 2 8 L 2 4 L 5 4 Z M 22 24 L 2 24 L 2 10 L 22 10 L 22 24 Z M 10 13 L 10 21 C 10 21.265 9.895 21.52 9.707 21.707 C 9.52 21.895 9.265 22 9 22 C 8.735 22 8.48 21.895 8.293 21.707 C 8.105 21.52 8 21.265 8 21 L 8 14.618 L 7.448 14.895 C 7.21 15.014 6.935 15.033 6.684 14.949 C 6.432 14.865 6.224 14.685 6.105 14.448 C 5.986 14.21 5.967 13.935 6.051 13.684 C 6.135 13.432 6.315 13.224 6.552 13.105 L 8.552 12.105 C 8.705 12.029 8.875 11.993 9.045 12 C 9.215 12.008 9.381 12.059 9.526 12.149 C 9.671 12.238 9.791 12.364 9.874 12.513 C 9.957 12.662 10 12.829 10 13 Z M 17.395 16.806 L 15 20 L 17 20 C 17.265 20 17.52 20.105 17.707 20.293 C 17.895 20.48 18 20.735 18 21 C 18 21.265 17.895 21.52 17.707 21.707 C 17.52 21.895 17.265 22 17 22 L 13 22 C 12.814 22 12.632 21.948 12.474 21.851 C 12.316 21.753 12.189 21.613 12.106 21.447 C 12.023 21.281 11.987 21.095 12.004 20.91 C 12.021 20.725 12.089 20.549 12.2 20.4 L 15.798 15.604 C 15.879 15.495 15.938 15.37 15.97 15.238 C 16.002 15.105 16.007 14.968 15.983 14.834 C 15.96 14.699 15.91 14.571 15.836 14.457 C 15.761 14.343 15.664 14.245 15.551 14.17 C 15.437 14.095 15.31 14.043 15.175 14.019 C 15.041 13.995 14.904 13.998 14.771 14.029 C 14.638 14.06 14.513 14.118 14.404 14.199 C 14.294 14.28 14.202 14.382 14.134 14.5 C 14.07 14.617 13.983 14.721 13.879 14.804 C 13.775 14.887 13.655 14.949 13.526 14.985 C 13.398 15.022 13.263 15.032 13.131 15.015 C 12.998 14.998 12.87 14.956 12.755 14.889 C 12.639 14.822 12.538 14.733 12.457 14.626 C 12.377 14.52 12.318 14.398 12.286 14.269 C 12.253 14.139 12.246 14.005 12.266 13.873 C 12.286 13.74 12.333 13.614 12.403 13.5 C 12.733 12.928 13.243 12.482 13.853 12.229 C 14.463 11.977 15.139 11.932 15.777 12.103 C 16.414 12.274 16.978 12.651 17.38 13.174 C 17.782 13.698 18 14.34 18 15 C 18.002 15.652 17.79 16.287 17.395 16.806 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 2)\"/>"
    },
    "CalendarWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 21.5 2 L 18 2 L 18 0.5 C 18 0.367 17.947 0.24 17.854 0.146 C 17.76 0.053 17.633 0 17.5 0 C 17.367 0 17.24 0.053 17.146 0.146 C 17.053 0.24 17 0.367 17 0.5 L 17 2 L 6 2 L 6 0.5 C 6 0.367 5.947 0.24 5.854 0.146 C 5.76 0.053 5.633 0 5.5 0 C 5.367 0 5.24 0.053 5.146 0.146 C 5.053 0.24 5 0.367 5 0.5 L 5 2 L 1.5 2 C 1.102 2 0.721 2.158 0.439 2.439 C 0.158 2.721 0 3.102 0 3.5 L 0 23.5 C 0 23.898 0.158 24.279 0.439 24.561 C 0.721 24.842 1.102 25 1.5 25 L 21.5 25 C 21.898 25 22.279 24.842 22.561 24.561 C 22.842 24.279 23 23.898 23 23.5 L 23 3.5 C 23 3.102 22.842 2.721 22.561 2.439 C 22.279 2.158 21.898 2 21.5 2 Z M 1.5 3 L 5 3 L 5 4.5 C 5 4.633 5.053 4.76 5.146 4.854 C 5.24 4.947 5.367 5 5.5 5 C 5.633 5 5.76 4.947 5.854 4.854 C 5.947 4.76 6 4.633 6 4.5 L 6 3 L 17 3 L 17 4.5 C 17 4.633 17.053 4.76 17.146 4.854 C 17.24 4.947 17.367 5 17.5 5 C 17.633 5 17.76 4.947 17.854 4.854 C 17.947 4.76 18 4.633 18 4.5 L 18 3 L 21.5 3 C 21.633 3 21.76 3.053 21.854 3.146 C 21.947 3.24 22 3.367 22 3.5 L 22 8 L 1 8 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 Z M 21.5 24 L 1.5 24 C 1.367 24 1.24 23.947 1.146 23.854 C 1.053 23.76 1 23.633 1 23.5 L 1 9 L 22 9 L 22 23.5 C 22 23.633 21.947 23.76 21.854 23.854 C 21.76 23.947 21.633 24 21.5 24 Z M 9 12.5 L 9 20.5 C 9 20.633 8.947 20.76 8.854 20.854 C 8.76 20.947 8.633 21 8.5 21 C 8.367 21 8.24 20.947 8.146 20.854 C 8.053 20.76 8 20.633 8 20.5 L 8 13.309 L 6.724 13.948 C 6.605 14.007 6.468 14.017 6.342 13.975 C 6.216 13.933 6.112 13.842 6.052 13.724 C 5.993 13.605 5.983 13.468 6.025 13.342 C 6.067 13.216 6.158 13.112 6.276 13.052 L 8.276 12.052 C 8.353 12.014 8.437 11.996 8.522 12 C 8.608 12.004 8.69 12.03 8.763 12.074 C 8.835 12.119 8.895 12.182 8.937 12.256 C 8.978 12.331 9 12.415 9 12.5 Z M 16.5 16 L 13.5 20 L 16.5 20 C 16.633 20 16.76 20.053 16.854 20.146 C 16.947 20.24 17 20.367 17 20.5 C 17 20.633 16.947 20.76 16.854 20.854 C 16.76 20.947 16.633 21 16.5 21 L 12.5 21 C 12.407 21 12.316 20.974 12.237 20.925 C 12.158 20.877 12.094 20.807 12.053 20.724 C 12.011 20.641 11.994 20.548 12.002 20.455 C 12.01 20.363 12.044 20.274 12.1 20.2 L 15.698 15.404 C 15.895 15.144 16.001 14.826 16 14.5 C 16 14.169 15.892 13.848 15.691 13.586 C 15.489 13.323 15.207 13.135 14.888 13.049 C 14.569 12.964 14.23 12.986 13.925 13.113 C 13.62 13.24 13.365 13.464 13.2 13.75 C 13.131 13.859 13.022 13.937 12.897 13.967 C 12.772 13.998 12.639 13.979 12.528 13.915 C 12.416 13.85 12.334 13.745 12.298 13.621 C 12.262 13.497 12.275 13.364 12.335 13.25 C 12.61 12.773 13.035 12.401 13.543 12.19 C 14.052 11.98 14.615 11.943 15.147 12.085 C 15.679 12.228 16.148 12.542 16.483 12.978 C 16.818 13.415 17 13.95 17 14.5 C 17.002 15.041 16.826 15.568 16.5 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 2.500)\"/>"
    },
    "CheckWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25.565 2.563 L 9.565 18.563 C 9.426 18.702 9.26 18.813 9.078 18.889 C 8.896 18.965 8.7 19.004 8.503 19.004 C 8.305 19.004 8.11 18.965 7.927 18.889 C 7.745 18.813 7.579 18.702 7.44 18.563 L 0.44 11.563 C 0.301 11.423 0.19 11.257 0.114 11.075 C 0.039 10.893 0 10.697 0 10.5 C 0 10.303 0.039 10.107 0.114 9.925 C 0.19 9.743 0.301 9.577 0.44 9.438 C 0.58 9.298 0.745 9.187 0.928 9.112 C 1.11 9.036 1.305 8.997 1.503 8.997 C 1.7 8.997 1.895 9.036 2.078 9.112 C 2.26 9.187 2.426 9.298 2.565 9.438 L 8.504 15.376 L 23.443 0.44 C 23.724 0.158 24.107 0 24.505 0 C 24.904 0 25.286 0.158 25.568 0.44 C 25.849 0.722 26.008 1.104 26.008 1.503 C 26.008 1.901 25.849 2.283 25.568 2.565 L 25.565 2.563 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.496 7.499)\"/>"
    },
    "CheckWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 26 2 L 26 20 C 26 20.53 25.789 21.039 25.414 21.414 C 25.039 21.789 24.53 22 24 22 L 2 22 C 1.47 22 0.961 21.789 0.586 21.414 C 0.211 21.039 0 20.53 0 20 L 0 2 C 0 1.47 0.211 0.961 0.586 0.586 C 0.961 0.211 1.47 0 2 0 L 24 0 C 24.53 0 25.039 0.211 25.414 0.586 C 25.789 0.961 26 1.47 26 2 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 5)\"/><path d=\"M 18.708 1.708 L 6.708 13.708 C 6.615 13.801 6.505 13.875 6.383 13.925 C 6.262 13.975 6.132 14.001 6.001 14.001 C 5.869 14.001 5.739 13.975 5.618 13.925 C 5.496 13.875 5.386 13.801 5.293 13.708 L 0.293 8.708 C 0.105 8.52 0 8.266 0 8.001 C 0 7.735 0.105 7.481 0.293 7.293 C 0.481 7.105 0.735 7 1.001 7 C 1.266 7 1.52 7.105 1.708 7.293 L 6.001 11.587 L 17.293 0.293 C 17.481 0.105 17.735 0 18.001 0 C 18.266 0 18.52 0.105 18.708 0.293 C 18.896 0.481 19.001 0.735 19.001 1.001 C 19.001 1.266 18.896 1.52 18.708 1.708 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.999 8.999)\"/>"
    },
    "CheckWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 0 L 2 0 C 1.47 0 0.961 0.211 0.586 0.586 C 0.211 0.961 0 1.47 0 2 L 0 20 C 0 20.53 0.211 21.039 0.586 21.414 C 0.961 21.789 1.47 22 2 22 L 24 22 C 24.53 22 25.039 21.789 25.414 21.414 C 25.789 21.039 26 20.53 26 20 L 26 2 C 26 1.47 25.789 0.961 25.414 0.586 C 25.039 0.211 24.53 0 24 0 Z M 22.708 5.708 L 10.708 17.708 C 10.615 17.8 10.504 17.874 10.383 17.925 C 10.262 17.975 10.131 18.001 10 18.001 C 9.869 18.001 9.738 17.975 9.617 17.925 C 9.496 17.874 9.385 17.8 9.292 17.708 L 4.293 12.708 C 4.105 12.52 3.999 12.265 3.999 12 C 3.999 11.735 4.105 11.48 4.293 11.292 C 4.48 11.105 4.735 10.999 5 10.999 C 5.265 10.999 5.52 11.105 5.708 11.292 L 10 15.586 L 21.292 4.292 C 21.48 4.105 21.735 3.999 22 3.999 C 22.265 3.999 22.52 4.105 22.708 4.292 C 22.895 4.48 23.001 4.735 23.001 5 C 23.001 5.265 22.895 5.52 22.708 5.708 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 5)\"/>"
    },
    "CheckWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24.261 1.261 L 8.261 17.261 C 8.121 17.402 7.93 17.481 7.731 17.481 C 7.533 17.481 7.342 17.402 7.201 17.261 L 0.201 10.261 C 0.069 10.119 -0.003 9.931 0 9.737 C 0.004 9.542 0.082 9.357 0.22 9.22 C 0.357 9.082 0.542 9.004 0.737 9 C 0.931 8.997 1.119 9.069 1.261 9.201 L 7.731 15.67 L 23.201 0.201 C 23.343 0.069 23.532 -0.003 23.726 0 C 23.92 0.004 24.106 0.082 24.243 0.22 C 24.38 0.357 24.459 0.542 24.462 0.737 C 24.466 0.931 24.394 1.119 24.261 1.261 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.269 8.269)\"/>"
    },
    "CheckWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24.708 1.708 L 8.708 17.708 C 8.615 17.801 8.505 17.875 8.383 17.925 C 8.262 17.975 8.132 18.001 8.001 18.001 C 7.869 18.001 7.739 17.975 7.618 17.925 C 7.496 17.875 7.386 17.801 7.293 17.708 L 0.293 10.708 C 0.105 10.52 0 10.266 0 10.001 C 0 9.735 0.105 9.481 0.293 9.293 C 0.481 9.105 0.735 9 1.001 9 C 1.266 9 1.52 9.105 1.708 9.293 L 8.001 15.587 L 23.293 0.293 C 23.481 0.105 23.735 0 24.001 0 C 24.266 0 24.52 0.105 24.708 0.293 C 24.896 0.481 25.001 0.735 25.001 1.001 C 25.001 1.266 24.896 1.52 24.708 1.708 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.999 7.999)\"/>"
    },
    "CheckWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.854 0.854 L 7.854 16.854 C 7.808 16.901 7.752 16.937 7.692 16.963 C 7.631 16.988 7.566 17.001 7.5 17.001 C 7.435 17.001 7.37 16.988 7.309 16.963 C 7.248 16.937 7.193 16.901 7.147 16.854 L 0.147 9.854 C 0.053 9.76 0 9.633 0 9.5 C 0 9.368 0.053 9.24 0.147 9.147 C 0.24 9.053 0.368 9 0.5 9 C 0.633 9 0.76 9.053 0.854 9.147 L 7.5 15.793 L 23.147 0.147 C 23.24 0.053 23.368 0 23.5 0 C 23.633 0 23.76 0.053 23.854 0.147 C 23.948 0.24 24.001 0.368 24.001 0.5 C 24.001 0.633 23.948 0.76 23.854 0.854 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 8.500)\"/>"
    },
    "ChevronDown": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 16.281 1.281 L 8.781 8.781 C 8.711 8.851 8.629 8.906 8.538 8.944 C 8.447 8.982 8.349 9.001 8.25 9.001 C 8.152 9.001 8.054 8.982 7.963 8.944 C 7.872 8.906 7.789 8.851 7.72 8.781 L 0.22 1.281 C 0.079 1.14 0 0.949 0 0.75 C 0 0.551 0.079 0.361 0.22 0.22 C 0.361 0.079 0.551 0 0.75 0 C 0.949 0 1.14 0.079 1.281 0.22 L 8.25 7.19 L 15.22 0.22 C 15.289 0.15 15.372 0.095 15.463 0.057 C 15.554 0.019 15.652 0 15.75 0 C 15.849 0 15.947 0.019 16.038 0.057 C 16.129 0.095 16.211 0.15 16.281 0.22 C 16.351 0.289 16.406 0.372 16.444 0.463 C 16.481 0.554 16.501 0.652 16.501 0.75 C 16.501 0.849 16.481 0.947 16.444 1.038 C 16.406 1.129 16.351 1.211 16.281 1.281 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.750 8.250)\"/>"
    },
    "ChevronLeft": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 8.781 15.22 C 8.851 15.289 8.906 15.372 8.944 15.463 C 8.982 15.554 9.001 15.652 9.001 15.75 C 9.001 15.849 8.982 15.947 8.944 16.038 C 8.906 16.129 8.851 16.211 8.781 16.281 C 8.712 16.351 8.629 16.406 8.538 16.444 C 8.447 16.481 8.349 16.501 8.251 16.501 C 8.152 16.501 8.054 16.481 7.963 16.444 C 7.872 16.406 7.79 16.351 7.72 16.281 L 0.22 8.781 C 0.15 8.711 0.095 8.629 0.057 8.538 C 0.019 8.447 0 8.349 0 8.25 C 0 8.152 0.019 8.054 0.057 7.963 C 0.095 7.872 0.15 7.789 0.22 7.72 L 7.72 0.22 C 7.861 0.079 8.052 0 8.251 0 C 8.45 0 8.64 0.079 8.781 0.22 C 8.922 0.361 9.001 0.551 9.001 0.75 C 9.001 0.949 8.922 1.14 8.781 1.281 L 1.811 8.25 L 8.781 15.22 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.749 3.750)\"/>"
    },
    "ChevronRight": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 8.781 8.781 L 1.281 16.281 C 1.211 16.351 1.129 16.406 1.038 16.444 C 0.947 16.481 0.849 16.501 0.75 16.501 C 0.652 16.501 0.554 16.481 0.463 16.444 C 0.372 16.406 0.289 16.351 0.22 16.281 C 0.15 16.211 0.095 16.129 0.057 16.038 C 0.019 15.947 0 15.849 0 15.75 C 0 15.652 0.019 15.554 0.057 15.463 C 0.095 15.372 0.15 15.289 0.22 15.22 L 7.19 8.25 L 0.22 1.281 C 0.079 1.14 0 0.949 0 0.75 C 0 0.551 0.079 0.361 0.22 0.22 C 0.361 0.079 0.551 0 0.75 0 C 0.949 0 1.14 0.079 1.281 0.22 L 8.781 7.72 C 8.851 7.789 8.906 7.872 8.944 7.963 C 8.982 8.054 9.001 8.152 9.001 8.25 C 9.001 8.349 8.982 8.447 8.944 8.538 C 8.906 8.629 8.851 8.711 8.781 8.781 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8.250 3.750)\"/>"
    },
    "ChevronUp": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 16.281 8.781 C 16.211 8.851 16.129 8.906 16.038 8.944 C 15.947 8.982 15.849 9.001 15.75 9.001 C 15.652 9.001 15.554 8.982 15.463 8.944 C 15.372 8.906 15.289 8.851 15.22 8.781 L 8.25 1.811 L 1.281 8.781 C 1.14 8.922 0.949 9.001 0.75 9.001 C 0.551 9.001 0.361 8.922 0.22 8.781 C 0.079 8.64 0 8.45 0 8.251 C 0 8.052 0.079 7.861 0.22 7.72 L 7.72 0.22 C 7.789 0.15 7.872 0.095 7.963 0.057 C 8.054 0.019 8.152 0 8.25 0 C 8.349 0 8.447 0.019 8.538 0.057 C 8.629 0.095 8.711 0.15 8.781 0.22 L 16.281 7.72 C 16.351 7.79 16.406 7.872 16.444 7.963 C 16.482 8.054 16.501 8.152 16.501 8.251 C 16.501 8.349 16.482 8.447 16.444 8.538 C 16.406 8.629 16.351 8.712 16.281 8.781 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.750 6.749)\"/>"
    },
    "ClockWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13.5 0 C 10.83 0 8.22 0.792 6 2.275 C 3.78 3.759 2.049 5.867 1.028 8.334 C 0.006 10.801 -0.261 13.515 0.259 16.134 C 0.78 18.752 2.066 21.158 3.954 23.046 C 5.842 24.934 8.248 26.22 10.866 26.741 C 13.485 27.262 16.199 26.994 18.666 25.972 C 21.133 24.951 23.241 23.22 24.725 21 C 26.208 18.78 27 16.17 27 13.5 C 26.996 9.921 25.572 6.489 23.042 3.958 C 20.511 1.428 17.079 0.004 13.5 0 Z M 13.5 24 C 11.423 24 9.393 23.384 7.667 22.23 C 5.94 21.077 4.594 19.437 3.799 17.518 C 3.005 15.6 2.797 13.488 3.202 11.452 C 3.607 9.415 4.607 7.544 6.075 6.075 C 7.544 4.607 9.415 3.607 11.452 3.202 C 13.488 2.797 15.6 3.005 17.518 3.799 C 19.437 4.594 21.077 5.94 22.23 7.667 C 23.384 9.393 24 11.423 24 13.5 C 23.997 16.284 22.89 18.953 20.921 20.921 C 18.953 22.89 16.284 23.997 13.5 24 Z M 22 13.5 C 22 13.898 21.842 14.279 21.561 14.561 C 21.279 14.842 20.898 15 20.5 15 L 13.5 15 C 13.102 15 12.721 14.842 12.439 14.561 C 12.158 14.279 12 13.898 12 13.5 L 12 6.5 C 12 6.102 12.158 5.721 12.439 5.439 C 12.721 5.158 13.102 5 13.5 5 C 13.898 5 14.279 5.158 14.561 5.439 C 14.842 5.721 15 6.102 15 6.5 L 15 12 L 20.5 12 C 20.898 12 21.279 12.158 21.561 12.439 C 21.842 12.721 22 13.102 22 13.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.500 2.500)\"/>"
    },
    "ClockWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 12 C 24 14.373 23.296 16.693 21.978 18.667 C 20.659 20.64 18.785 22.178 16.592 23.087 C 14.399 23.995 11.987 24.232 9.659 23.769 C 7.331 23.306 5.193 22.164 3.515 20.485 C 1.836 18.807 0.694 16.669 0.231 14.341 C -0.232 12.013 0.005 9.601 0.913 7.408 C 1.822 5.215 3.36 3.341 5.333 2.022 C 7.307 0.704 9.627 0 12 0 C 15.183 0 18.235 1.264 20.485 3.515 C 22.736 5.765 24 8.817 24 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/><path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 13 24 C 10.824 24 8.698 23.355 6.889 22.146 C 5.08 20.937 3.67 19.22 2.837 17.21 C 2.005 15.2 1.787 12.988 2.211 10.854 C 2.636 8.72 3.683 6.76 5.222 5.222 C 6.76 3.683 8.72 2.636 10.854 2.211 C 12.988 1.787 15.2 2.005 17.21 2.837 C 19.22 3.67 20.937 5.08 22.146 6.889 C 23.355 8.698 24 10.824 24 13 C 23.997 15.916 22.837 18.712 20.775 20.775 C 18.712 22.837 15.916 23.997 13 24 Z M 21 13 C 21 13.265 20.895 13.52 20.707 13.707 C 20.52 13.895 20.265 14 20 14 L 13 14 C 12.735 14 12.48 13.895 12.293 13.707 C 12.105 13.52 12 13.265 12 13 L 12 6 C 12 5.735 12.105 5.48 12.293 5.293 C 12.48 5.105 12.735 5 13 5 C 13.265 5 13.52 5.105 13.707 5.293 C 13.895 5.48 14 5.735 14 6 L 14 12 L 20 12 C 20.265 12 20.52 12.105 20.707 12.293 C 20.895 12.48 21 12.735 21 13 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "ClockWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 20 14 L 13 14 C 12.735 14 12.48 13.895 12.293 13.707 C 12.105 13.52 12 13.265 12 13 L 12 6 C 12 5.735 12.105 5.48 12.293 5.293 C 12.48 5.105 12.735 5 13 5 C 13.265 5 13.52 5.105 13.707 5.293 C 13.895 5.48 14 5.735 14 6 L 14 12 L 20 12 C 20.265 12 20.52 12.105 20.707 12.293 C 20.895 12.48 21 12.735 21 13 C 21 13.265 20.895 13.52 20.707 13.707 C 20.52 13.895 20.265 14 20 14 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "ClockWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 12.75 0 C 10.228 0 7.763 0.748 5.666 2.149 C 3.57 3.55 1.936 5.541 0.971 7.871 C 0.006 10.201 -0.247 12.764 0.245 15.237 C 0.737 17.711 1.951 19.982 3.734 21.766 C 5.518 23.549 7.789 24.763 10.263 25.255 C 12.736 25.747 15.299 25.494 17.629 24.529 C 19.959 23.564 21.95 21.93 23.351 19.834 C 24.752 17.737 25.5 15.272 25.5 12.75 C 25.496 9.37 24.151 6.129 21.761 3.739 C 19.371 1.349 16.13 0.004 12.75 0 Z M 12.75 24 C 10.525 24 8.35 23.34 6.5 22.104 C 4.65 20.868 3.208 19.111 2.356 17.055 C 1.505 15 1.282 12.738 1.716 10.555 C 2.15 8.373 3.222 6.368 4.795 4.795 C 6.368 3.222 8.373 2.15 10.555 1.716 C 12.738 1.282 15 1.505 17.055 2.356 C 19.111 3.208 20.868 4.65 22.104 6.5 C 23.34 8.35 24 10.525 24 12.75 C 23.997 15.733 22.81 18.592 20.701 20.701 C 18.592 22.81 15.733 23.997 12.75 24 Z M 20.5 12.75 C 20.5 12.949 20.421 13.14 20.28 13.28 C 20.14 13.421 19.949 13.5 19.75 13.5 L 12.75 13.5 C 12.551 13.5 12.36 13.421 12.22 13.28 C 12.079 13.14 12 12.949 12 12.75 L 12 5.75 C 12 5.551 12.079 5.36 12.22 5.22 C 12.36 5.079 12.551 5 12.75 5 C 12.949 5 13.14 5.079 13.28 5.22 C 13.421 5.36 13.5 5.551 13.5 5.75 L 13.5 12 L 19.75 12 C 19.949 12 20.14 12.079 20.28 12.22 C 20.421 12.36 20.5 12.551 20.5 12.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.250 3.250)\"/>"
    },
    "ClockWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 13 24 C 10.824 24 8.698 23.355 6.889 22.146 C 5.08 20.937 3.67 19.22 2.837 17.21 C 2.005 15.2 1.787 12.988 2.211 10.854 C 2.636 8.72 3.683 6.76 5.222 5.222 C 6.76 3.683 8.72 2.636 10.854 2.211 C 12.988 1.787 15.2 2.005 17.21 2.837 C 19.22 3.67 20.937 5.08 22.146 6.889 C 23.355 8.698 24 10.824 24 13 C 23.997 15.916 22.837 18.712 20.775 20.775 C 18.712 22.837 15.916 23.997 13 24 Z M 21 13 C 21 13.265 20.895 13.52 20.707 13.707 C 20.52 13.895 20.265 14 20 14 L 13 14 C 12.735 14 12.48 13.895 12.293 13.707 C 12.105 13.52 12 13.265 12 13 L 12 6 C 12 5.735 12.105 5.48 12.293 5.293 C 12.48 5.105 12.735 5 13 5 C 13.265 5 13.52 5.105 13.707 5.293 C 13.895 5.48 14 5.735 14 6 L 14 12 L 20 12 C 20.265 12 20.52 12.105 20.707 12.293 C 20.895 12.48 21 12.735 21 13 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "ClockWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 12.5 0 C 10.028 0 7.611 0.733 5.555 2.107 C 3.5 3.48 1.898 5.432 0.952 7.716 C 0.005 10.001 -0.242 12.514 0.24 14.939 C 0.723 17.363 1.913 19.591 3.661 21.339 C 5.409 23.087 7.637 24.278 10.061 24.76 C 12.486 25.242 14.999 24.995 17.284 24.048 C 19.568 23.102 21.52 21.5 22.893 19.445 C 24.267 17.389 25 14.972 25 12.5 C 24.996 9.186 23.678 6.009 21.335 3.665 C 18.991 1.322 15.814 0.004 12.5 0 Z M 12.5 24 C 10.226 24 8.002 23.326 6.111 22.062 C 4.22 20.798 2.746 19.002 1.875 16.901 C 1.005 14.8 0.777 12.487 1.221 10.256 C 1.665 8.026 2.76 5.977 4.368 4.368 C 5.977 2.76 8.026 1.665 10.256 1.221 C 12.487 0.777 14.8 1.005 16.901 1.875 C 19.002 2.746 20.798 4.22 22.062 6.111 C 23.326 8.002 24 10.226 24 12.5 C 23.997 15.549 22.784 18.472 20.628 20.628 C 18.472 22.784 15.549 23.997 12.5 24 Z M 20 12.5 C 20 12.633 19.947 12.76 19.854 12.854 C 19.76 12.947 19.633 13 19.5 13 L 12.5 13 C 12.367 13 12.24 12.947 12.146 12.854 C 12.053 12.76 12 12.633 12 12.5 L 12 5.5 C 12 5.367 12.053 5.24 12.146 5.146 C 12.24 5.053 12.367 5 12.5 5 C 12.633 5 12.76 5.053 12.854 5.146 C 12.947 5.24 13 5.367 13 5.5 L 13 12 L 19.5 12 C 19.633 12 19.76 12.053 19.854 12.146 C 19.947 12.24 20 12.367 20 12.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 3.500)\"/>"
    },
    "CopyWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.5 0 L 7.5 0 C 7.102 0 6.721 0.158 6.439 0.439 C 6.158 0.721 6 1.102 6 1.5 L 6 6 L 1.5 6 C 1.102 6 0.721 6.158 0.439 6.439 C 0.158 6.721 0 7.102 0 7.5 L 0 23.5 C 0 23.898 0.158 24.279 0.439 24.561 C 0.721 24.842 1.102 25 1.5 25 L 17.5 25 C 17.898 25 18.279 24.842 18.561 24.561 C 18.842 24.279 19 23.898 19 23.5 L 19 19 L 23.5 19 C 23.898 19 24.279 18.842 24.561 18.561 C 24.842 18.279 25 17.898 25 17.5 L 25 1.5 C 25 1.102 24.842 0.721 24.561 0.439 C 24.279 0.158 23.898 0 23.5 0 Z M 16 22 L 3 22 L 3 9 L 16 9 L 16 22 Z M 22 16 L 19 16 L 19 7.5 C 19 7.102 18.842 6.721 18.561 6.439 C 18.279 6.158 17.898 6 17.5 6 L 9 6 L 9 3 L 22 3 L 22 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 3.500)\"/>"
    },
    "CopyWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 16 0 L 16 16 L 10 16 L 10 6 L 0 6 L 0 0 L 16 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 11 5)\"/><path d=\"M 23 0 L 7 0 C 6.735 0 6.48 0.105 6.293 0.293 C 6.105 0.48 6 0.735 6 1 L 6 6 L 1 6 C 0.735 6 0.48 6.105 0.293 6.293 C 0.105 6.48 0 6.735 0 7 L 0 23 C 0 23.265 0.105 23.52 0.293 23.707 C 0.48 23.895 0.735 24 1 24 L 17 24 C 17.265 24 17.52 23.895 17.707 23.707 C 17.895 23.52 18 23.265 18 23 L 18 18 L 23 18 C 23.265 18 23.52 17.895 23.707 17.707 C 23.895 17.52 24 17.265 24 17 L 24 1 C 24 0.735 23.895 0.48 23.707 0.293 C 23.52 0.105 23.265 0 23 0 Z M 16 22 L 2 22 L 2 8 L 16 8 L 16 22 Z M 22 16 L 18 16 L 18 7 C 18 6.735 17.895 6.48 17.707 6.293 C 17.52 6.105 17.265 6 17 6 L 8 6 L 8 2 L 22 2 L 22 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
    },
    "CopyWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23 0 L 7 0 C 6.735 0 6.48 0.105 6.293 0.293 C 6.105 0.48 6 0.735 6 1 L 6 6 L 1 6 C 0.735 6 0.48 6.105 0.293 6.293 C 0.105 6.48 0 6.735 0 7 L 0 23 C 0 23.265 0.105 23.52 0.293 23.707 C 0.48 23.895 0.735 24 1 24 L 17 24 C 17.265 24 17.52 23.895 17.707 23.707 C 17.895 23.52 18 23.265 18 23 L 18 18 L 23 18 C 23.265 18 23.52 17.895 23.707 17.707 C 23.895 17.52 24 17.265 24 17 L 24 1 C 24 0.735 23.895 0.48 23.707 0.293 C 23.52 0.105 23.265 0 23 0 Z M 22 16 L 18 16 L 18 7 C 18 6.735 17.895 6.48 17.707 6.293 C 17.52 6.105 17.265 6 17 6 L 8 6 L 8 2 L 22 2 L 22 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
    },
    "CopyWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22.75 0 L 6.75 0 C 6.551 0 6.36 0.079 6.22 0.22 C 6.079 0.36 6 0.551 6 0.75 L 6 6 L 0.75 6 C 0.551 6 0.36 6.079 0.22 6.22 C 0.079 6.36 0 6.551 0 6.75 L 0 22.75 C 0 22.949 0.079 23.14 0.22 23.28 C 0.36 23.421 0.551 23.5 0.75 23.5 L 16.75 23.5 C 16.949 23.5 17.14 23.421 17.28 23.28 C 17.421 23.14 17.5 22.949 17.5 22.75 L 17.5 17.5 L 22.75 17.5 C 22.949 17.5 23.14 17.421 23.28 17.28 C 23.421 17.14 23.5 16.949 23.5 16.75 L 23.5 0.75 C 23.5 0.551 23.421 0.36 23.28 0.22 C 23.14 0.079 22.949 0 22.75 0 Z M 16 22 L 1.5 22 L 1.5 7.5 L 16 7.5 L 16 22 Z M 22 16 L 17.5 16 L 17.5 6.75 C 17.5 6.551 17.421 6.36 17.28 6.22 C 17.14 6.079 16.949 6 16.75 6 L 7.5 6 L 7.5 1.5 L 22 1.5 L 22 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.250 4.250)\"/>"
    },
    "CopyWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23 0 L 7 0 C 6.735 0 6.48 0.105 6.293 0.293 C 6.105 0.48 6 0.735 6 1 L 6 6 L 1 6 C 0.735 6 0.48 6.105 0.293 6.293 C 0.105 6.48 0 6.735 0 7 L 0 23 C 0 23.265 0.105 23.52 0.293 23.707 C 0.48 23.895 0.735 24 1 24 L 17 24 C 17.265 24 17.52 23.895 17.707 23.707 C 17.895 23.52 18 23.265 18 23 L 18 18 L 23 18 C 23.265 18 23.52 17.895 23.707 17.707 C 23.895 17.52 24 17.265 24 17 L 24 1 C 24 0.735 23.895 0.48 23.707 0.293 C 23.52 0.105 23.265 0 23 0 Z M 16 22 L 2 22 L 2 8 L 16 8 L 16 22 Z M 22 16 L 18 16 L 18 7 C 18 6.735 17.895 6.48 17.707 6.293 C 17.52 6.105 17.265 6 17 6 L 8 6 L 8 2 L 22 2 L 22 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
    },
    "CopyWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22.5 0 L 6.5 0 C 6.367 0 6.24 0.053 6.146 0.146 C 6.053 0.24 6 0.367 6 0.5 L 6 6 L 0.5 6 C 0.367 6 0.24 6.053 0.146 6.146 C 0.053 6.24 0 6.367 0 6.5 L 0 22.5 C 0 22.633 0.053 22.76 0.146 22.854 C 0.24 22.947 0.367 23 0.5 23 L 16.5 23 C 16.633 23 16.76 22.947 16.854 22.854 C 16.947 22.76 17 22.633 17 22.5 L 17 17 L 22.5 17 C 22.633 17 22.76 16.947 22.854 16.854 C 22.947 16.76 23 16.633 23 16.5 L 23 0.5 C 23 0.367 22.947 0.24 22.854 0.146 C 22.76 0.053 22.633 0 22.5 0 Z M 16 22 L 1 22 L 1 7 L 16 7 L 16 22 Z M 22 16 L 17 16 L 17 6.5 C 17 6.367 16.947 6.24 16.854 6.146 C 16.76 6.053 16.633 6 16.5 6 L 7 6 L 7 1 L 22 1 L 22 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 4.500)\"/>"
    },
    "DotsHorizontal": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 8.625 1.125 C 8.625 1.348 8.559 1.565 8.435 1.75 C 8.312 1.935 8.136 2.079 7.931 2.164 C 7.725 2.25 7.499 2.272 7.281 2.228 C 7.062 2.185 6.862 2.078 6.705 1.92 C 6.547 1.763 6.44 1.563 6.397 1.344 C 6.353 1.126 6.375 0.9 6.461 0.694 C 6.546 0.489 6.69 0.313 6.875 0.19 C 7.06 0.066 7.277 0 7.5 0 C 7.798 0 8.085 0.119 8.295 0.33 C 8.506 0.54 8.625 0.827 8.625 1.125 Z M 13.875 0 C 13.652 0 13.435 0.066 13.25 0.19 C 13.065 0.313 12.921 0.489 12.836 0.694 C 12.75 0.9 12.728 1.126 12.772 1.344 C 12.815 1.563 12.922 1.763 13.08 1.92 C 13.237 2.078 13.437 2.185 13.656 2.228 C 13.874 2.272 14.1 2.25 14.306 2.164 C 14.511 2.079 14.687 1.935 14.81 1.75 C 14.934 1.565 15 1.348 15 1.125 C 15 0.827 14.881 0.54 14.67 0.33 C 14.46 0.119 14.173 0 13.875 0 Z M 1.125 0 C 0.902 0 0.685 0.066 0.5 0.19 C 0.315 0.313 0.171 0.489 0.086 0.694 C 0 0.9 -0.022 1.126 0.022 1.344 C 0.065 1.563 0.172 1.763 0.33 1.92 C 0.487 2.078 0.687 2.185 0.906 2.228 C 1.124 2.272 1.35 2.25 1.556 2.164 C 1.761 2.079 1.937 1.935 2.06 1.75 C 2.184 1.565 2.25 1.348 2.25 1.125 C 2.25 0.827 2.131 0.54 1.92 0.33 C 1.71 0.119 1.423 0 1.125 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 10.875)\"/>"
    },
    "DotsVertical": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 2.25 7.5 C 2.25 7.723 2.184 7.94 2.06 8.125 C 1.937 8.31 1.761 8.454 1.556 8.539 C 1.35 8.625 1.124 8.647 0.906 8.603 C 0.687 8.56 0.487 8.453 0.33 8.295 C 0.172 8.138 0.065 7.938 0.022 7.719 C -0.022 7.501 0 7.275 0.086 7.069 C 0.171 6.864 0.315 6.688 0.5 6.565 C 0.685 6.441 0.902 6.375 1.125 6.375 C 1.423 6.375 1.71 6.494 1.92 6.705 C 2.131 6.915 2.25 7.202 2.25 7.5 Z M 1.125 2.25 C 1.348 2.25 1.565 2.184 1.75 2.06 C 1.935 1.937 2.079 1.761 2.164 1.556 C 2.25 1.35 2.272 1.124 2.228 0.906 C 2.185 0.687 2.078 0.487 1.92 0.33 C 1.763 0.172 1.563 0.065 1.344 0.022 C 1.126 -0.022 0.9 0 0.694 0.086 C 0.489 0.171 0.313 0.315 0.19 0.5 C 0.066 0.685 0 0.902 0 1.125 C 0 1.423 0.119 1.71 0.33 1.92 C 0.54 2.131 0.827 2.25 1.125 2.25 Z M 1.125 12.75 C 0.902 12.75 0.685 12.816 0.5 12.94 C 0.315 13.063 0.171 13.239 0.086 13.444 C 0 13.65 -0.022 13.876 0.022 14.094 C 0.065 14.313 0.172 14.513 0.33 14.67 C 0.487 14.828 0.687 14.935 0.906 14.978 C 1.124 15.022 1.35 15 1.556 14.914 C 1.761 14.829 1.937 14.685 2.06 14.5 C 2.184 14.315 2.25 14.098 2.25 13.875 C 2.25 13.577 2.131 13.29 1.92 13.08 C 1.71 12.869 1.423 12.75 1.125 12.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 10.875 4.500)\"/>"
    },
    "DownloadWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 7.439 9.561 C 7.157 9.279 6.999 8.897 6.999 8.499 C 6.999 8.1 7.157 7.718 7.439 7.436 C 7.721 7.154 8.103 6.996 8.501 6.996 C 8.9 6.996 9.282 7.154 9.564 7.436 L 13 10.875 L 13 1.5 C 13 1.102 13.158 0.721 13.439 0.439 C 13.721 0.158 14.102 0 14.5 0 C 14.898 0 15.279 0.158 15.561 0.439 C 15.842 0.721 16 1.102 16 1.5 L 16 10.875 L 19.439 7.435 C 19.721 7.153 20.103 6.995 20.501 6.995 C 20.9 6.995 21.282 7.153 21.564 7.435 C 21.846 7.717 22.004 8.099 22.004 8.498 C 22.004 8.896 21.846 9.278 21.564 9.56 L 15.564 15.56 C 15.424 15.7 15.259 15.811 15.076 15.887 C 14.894 15.962 14.699 16.001 14.501 16.001 C 14.304 16.001 14.108 15.962 13.926 15.887 C 13.744 15.811 13.578 15.7 13.439 15.56 L 7.439 9.561 Z M 26.5 13 L 22 13 C 21.602 13 21.221 13.158 20.939 13.439 C 20.658 13.721 20.5 14.102 20.5 14.5 C 20.5 14.898 20.658 15.279 20.939 15.561 C 21.221 15.842 21.602 16 22 16 L 26 16 L 26 23 L 3 23 L 3 16 L 7 16 C 7.398 16 7.779 15.842 8.061 15.561 C 8.342 15.279 8.5 14.898 8.5 14.5 C 8.5 14.102 8.342 13.721 8.061 13.439 C 7.779 13.158 7.398 13 7 13 L 2.5 13 C 1.837 13 1.201 13.263 0.732 13.732 C 0.263 14.201 0 14.837 0 15.5 L 0 23.5 C 0 24.163 0.263 24.799 0.732 25.268 C 1.201 25.737 1.837 26 2.5 26 L 26.5 26 C 27.163 26 27.799 25.737 28.268 25.268 C 28.737 24.799 29 24.163 29 23.5 L 29 15.5 C 29 14.837 28.737 14.201 28.268 13.732 C 27.799 13.263 27.163 13 26.5 13 Z M 24 19.5 C 24 19.104 23.883 18.718 23.663 18.389 C 23.443 18.06 23.131 17.804 22.765 17.652 C 22.4 17.501 21.998 17.461 21.61 17.538 C 21.222 17.616 20.865 17.806 20.586 18.086 C 20.306 18.365 20.116 18.722 20.038 19.11 C 19.961 19.498 20.001 19.9 20.152 20.265 C 20.304 20.631 20.56 20.943 20.889 21.163 C 21.218 21.383 21.604 21.5 22 21.5 C 22.53 21.5 23.039 21.289 23.414 20.914 C 23.789 20.539 24 20.03 24 19.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.500 1.500)\"/>"
    },
    "DownloadWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 26 1 L 26 9 C 26 9.265 25.895 9.52 25.707 9.707 C 25.52 9.895 25.265 10 25 10 L 1 10 C 0.735 10 0.48 9.895 0.293 9.707 C 0.105 9.52 0 9.265 0 9 L 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 25 0 C 25.265 0 25.52 0.105 25.707 0.293 C 25.895 0.48 26 0.735 26 1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 16)\"/><path d=\"M 28 15 L 28 23 C 28 23.53 27.789 24.039 27.414 24.414 C 27.039 24.789 26.53 25 26 25 L 2 25 C 1.47 25 0.961 24.789 0.586 24.414 C 0.211 24.039 0 23.53 0 23 L 0 15 C 0 14.47 0.211 13.961 0.586 13.586 C 0.961 13.211 1.47 13 2 13 L 7 13 C 7.265 13 7.52 13.105 7.707 13.293 C 7.895 13.48 8 13.735 8 14 C 8 14.265 7.895 14.52 7.707 14.707 C 7.52 14.895 7.265 15 7 15 L 2 15 L 2 23 L 26 23 L 26 15 L 21 15 C 20.735 15 20.48 14.895 20.293 14.707 C 20.105 14.52 20 14.265 20 14 C 20 13.735 20.105 13.48 20.293 13.293 C 20.48 13.105 20.735 13 21 13 L 26 13 C 26.53 13 27.039 13.211 27.414 13.586 C 27.789 13.961 28 14.47 28 15 Z M 13.292 14.708 C 13.385 14.8 13.496 14.874 13.617 14.925 C 13.738 14.975 13.869 15.001 14 15.001 C 14.131 15.001 14.262 14.975 14.383 14.925 C 14.504 14.874 14.615 14.8 14.708 14.708 L 20.708 8.708 C 20.895 8.52 21.001 8.265 21.001 8 C 21.001 7.735 20.895 7.48 20.708 7.292 C 20.52 7.105 20.265 6.999 20 6.999 C 19.735 6.999 19.48 7.105 19.292 7.292 L 15 11.586 L 15 1 C 15 0.735 14.895 0.48 14.707 0.293 C 14.52 0.105 14.265 0 14 0 C 13.735 0 13.48 0.105 13.293 0.293 C 13.105 0.48 13 0.735 13 1 L 13 11.586 L 8.708 7.292 C 8.52 7.105 8.265 6.999 8 6.999 C 7.735 6.999 7.48 7.105 7.293 7.293 C 7.105 7.48 6.999 7.735 6.999 8 C 6.999 8.265 7.105 8.52 7.292 8.708 L 13.292 14.708 Z M 23 19 C 23 18.703 22.912 18.413 22.747 18.167 C 22.582 17.92 22.348 17.728 22.074 17.614 C 21.8 17.501 21.498 17.471 21.207 17.529 C 20.916 17.587 20.649 17.73 20.439 17.939 C 20.23 18.149 20.087 18.416 20.029 18.707 C 19.971 18.998 20.001 19.3 20.114 19.574 C 20.228 19.848 20.42 20.082 20.667 20.247 C 20.913 20.412 21.203 20.5 21.5 20.5 C 21.898 20.5 22.279 20.342 22.561 20.061 C 22.842 19.779 23 19.398 23 19 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 2)\"/>"
    },
    "DownloadWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 7.292 8.708 C 7.105 8.52 6.999 8.265 6.999 8 C 6.999 7.735 7.105 7.48 7.293 7.293 C 7.48 7.105 7.735 6.999 8 6.999 C 8.265 6.999 8.52 7.105 8.708 7.292 L 13 11.586 L 13 1 C 13 0.735 13.105 0.48 13.293 0.293 C 13.48 0.105 13.735 0 14 0 C 14.265 0 14.52 0.105 14.707 0.293 C 14.895 0.48 15 0.735 15 1 L 15 11.586 L 19.292 7.292 C 19.48 7.105 19.735 6.999 20 6.999 C 20.265 6.999 20.52 7.105 20.708 7.292 C 20.895 7.48 21.001 7.735 21.001 8 C 21.001 8.265 20.895 8.52 20.708 8.708 L 14.708 14.708 C 14.615 14.8 14.504 14.874 14.383 14.925 C 14.262 14.975 14.131 15.001 14 15.001 C 13.869 15.001 13.738 14.975 13.617 14.925 C 13.496 14.874 13.385 14.8 13.292 14.708 L 7.292 8.708 Z M 28 15 L 28 23 C 28 23.53 27.789 24.039 27.414 24.414 C 27.039 24.789 26.53 25 26 25 L 2 25 C 1.47 25 0.961 24.789 0.586 24.414 C 0.211 24.039 0 23.53 0 23 L 0 15 C 0 14.47 0.211 13.961 0.586 13.586 C 0.961 13.211 1.47 13 2 13 L 8.55 13 C 8.616 13 8.681 13.013 8.741 13.038 C 8.802 13.063 8.857 13.1 8.904 13.146 L 11.875 16.125 C 12.154 16.405 12.485 16.627 12.85 16.778 C 13.214 16.929 13.605 17.007 14 17.007 C 14.395 17.007 14.786 16.929 15.15 16.778 C 15.515 16.627 15.846 16.405 16.125 16.125 L 19.1 13.15 C 19.192 13.056 19.318 13.002 19.45 13 L 26 13 C 26.53 13 27.039 13.211 27.414 13.586 C 27.789 13.961 28 14.47 28 15 Z M 23 19 C 23 18.703 22.912 18.413 22.747 18.167 C 22.582 17.92 22.348 17.728 22.074 17.614 C 21.8 17.501 21.498 17.471 21.207 17.529 C 20.916 17.587 20.649 17.73 20.439 17.939 C 20.23 18.149 20.087 18.416 20.029 18.707 C 19.971 18.998 20.001 19.3 20.114 19.574 C 20.228 19.848 20.42 20.082 20.667 20.247 C 20.913 20.412 21.203 20.5 21.5 20.5 C 21.898 20.5 22.279 20.342 22.561 20.061 C 22.842 19.779 23 19.398 23 19 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 2)\"/>"
    },
    "DownloadWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 27.5 14.75 L 27.5 22.75 C 27.5 23.214 27.316 23.659 26.987 23.987 C 26.659 24.316 26.214 24.5 25.75 24.5 L 1.75 24.5 C 1.286 24.5 0.841 24.316 0.513 23.987 C 0.184 23.659 0 23.214 0 22.75 L 0 14.75 C 0 14.286 0.184 13.841 0.513 13.513 C 0.841 13.184 1.286 13 1.75 13 L 6.75 13 C 6.949 13 7.14 13.079 7.28 13.22 C 7.421 13.36 7.5 13.551 7.5 13.75 C 7.5 13.949 7.421 14.14 7.28 14.28 C 7.14 14.421 6.949 14.5 6.75 14.5 L 1.75 14.5 C 1.684 14.5 1.62 14.526 1.573 14.573 C 1.526 14.62 1.5 14.684 1.5 14.75 L 1.5 22.75 C 1.5 22.816 1.526 22.88 1.573 22.927 C 1.62 22.974 1.684 23 1.75 23 L 25.75 23 C 25.816 23 25.88 22.974 25.927 22.927 C 25.974 22.88 26 22.816 26 22.75 L 26 14.75 C 26 14.684 25.974 14.62 25.927 14.573 C 25.88 14.526 25.816 14.5 25.75 14.5 L 20.75 14.5 C 20.551 14.5 20.36 14.421 20.22 14.28 C 20.079 14.14 20 13.949 20 13.75 C 20 13.551 20.079 13.36 20.22 13.22 C 20.36 13.079 20.551 13 20.75 13 L 25.75 13 C 26.214 13 26.659 13.184 26.987 13.513 C 27.316 13.841 27.5 14.286 27.5 14.75 Z M 13.22 14.28 C 13.361 14.42 13.551 14.499 13.75 14.499 C 13.949 14.499 14.139 14.42 14.28 14.28 L 20.28 8.28 C 20.412 8.138 20.485 7.95 20.481 7.755 C 20.478 7.561 20.399 7.376 20.262 7.238 C 20.124 7.101 19.939 7.022 19.745 7.019 C 19.55 7.015 19.362 7.088 19.22 7.22 L 14.5 11.939 L 14.5 0.75 C 14.5 0.551 14.421 0.36 14.28 0.22 C 14.14 0.079 13.949 0 13.75 0 C 13.551 0 13.36 0.079 13.22 0.22 C 13.079 0.36 13 0.551 13 0.75 L 13 11.939 L 8.28 7.22 C 8.138 7.088 7.95 7.015 7.755 7.019 C 7.561 7.022 7.376 7.101 7.238 7.238 C 7.101 7.376 7.022 7.561 7.019 7.755 C 7.015 7.95 7.088 8.138 7.22 8.28 L 13.22 14.28 Z M 22.5 18.75 C 22.5 18.503 22.427 18.261 22.289 18.056 C 22.152 17.85 21.957 17.69 21.728 17.595 C 21.5 17.501 21.249 17.476 21.006 17.524 C 20.764 17.572 20.541 17.691 20.366 17.866 C 20.191 18.041 20.072 18.264 20.024 18.506 C 19.976 18.749 20.001 19 20.095 19.228 C 20.19 19.457 20.35 19.652 20.556 19.789 C 20.761 19.927 21.003 20 21.25 20 C 21.582 20 21.899 19.868 22.134 19.634 C 22.368 19.399 22.5 19.082 22.5 18.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "DownloadWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 28 15 L 28 23 C 28 23.53 27.789 24.039 27.414 24.414 C 27.039 24.789 26.53 25 26 25 L 2 25 C 1.47 25 0.961 24.789 0.586 24.414 C 0.211 24.039 0 23.53 0 23 L 0 15 C 0 14.47 0.211 13.961 0.586 13.586 C 0.961 13.211 1.47 13 2 13 L 7 13 C 7.265 13 7.52 13.105 7.707 13.293 C 7.895 13.48 8 13.735 8 14 C 8 14.265 7.895 14.52 7.707 14.707 C 7.52 14.895 7.265 15 7 15 L 2 15 L 2 23 L 26 23 L 26 15 L 21 15 C 20.735 15 20.48 14.895 20.293 14.707 C 20.105 14.52 20 14.265 20 14 C 20 13.735 20.105 13.48 20.293 13.293 C 20.48 13.105 20.735 13 21 13 L 26 13 C 26.53 13 27.039 13.211 27.414 13.586 C 27.789 13.961 28 14.47 28 15 Z M 13.292 14.708 C 13.385 14.8 13.496 14.874 13.617 14.925 C 13.738 14.975 13.869 15.001 14 15.001 C 14.131 15.001 14.262 14.975 14.383 14.925 C 14.504 14.874 14.615 14.8 14.708 14.708 L 20.708 8.708 C 20.895 8.52 21.001 8.265 21.001 8 C 21.001 7.735 20.895 7.48 20.708 7.292 C 20.52 7.105 20.265 6.999 20 6.999 C 19.735 6.999 19.48 7.105 19.292 7.292 L 15 11.586 L 15 1 C 15 0.735 14.895 0.48 14.707 0.293 C 14.52 0.105 14.265 0 14 0 C 13.735 0 13.48 0.105 13.293 0.293 C 13.105 0.48 13 0.735 13 1 L 13 11.586 L 8.708 7.292 C 8.52 7.105 8.265 6.999 8 6.999 C 7.735 6.999 7.48 7.105 7.293 7.293 C 7.105 7.48 6.999 7.735 6.999 8 C 6.999 8.265 7.105 8.52 7.292 8.708 L 13.292 14.708 Z M 23 19 C 23 18.703 22.912 18.413 22.747 18.167 C 22.582 17.92 22.348 17.728 22.074 17.614 C 21.8 17.501 21.498 17.471 21.207 17.529 C 20.916 17.587 20.649 17.73 20.439 17.939 C 20.23 18.149 20.087 18.416 20.029 18.707 C 19.971 18.998 20.001 19.3 20.114 19.574 C 20.228 19.848 20.42 20.082 20.667 20.247 C 20.913 20.412 21.203 20.5 21.5 20.5 C 21.898 20.5 22.279 20.342 22.561 20.061 C 22.842 19.779 23 19.398 23 19 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 2)\"/>"
    },
    "DownloadWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 27 14.5 L 27 22.5 C 27 22.898 26.842 23.279 26.561 23.561 C 26.279 23.842 25.898 24 25.5 24 L 1.5 24 C 1.102 24 0.721 23.842 0.439 23.561 C 0.158 23.279 0 22.898 0 22.5 L 0 14.5 C 0 14.102 0.158 13.721 0.439 13.439 C 0.721 13.158 1.102 13 1.5 13 L 6.5 13 C 6.633 13 6.76 13.053 6.854 13.146 C 6.947 13.24 7 13.367 7 13.5 C 7 13.633 6.947 13.76 6.854 13.854 C 6.76 13.947 6.633 14 6.5 14 L 1.5 14 C 1.367 14 1.24 14.053 1.146 14.146 C 1.053 14.24 1 14.367 1 14.5 L 1 22.5 C 1 22.633 1.053 22.76 1.146 22.854 C 1.24 22.947 1.367 23 1.5 23 L 25.5 23 C 25.633 23 25.76 22.947 25.854 22.854 C 25.947 22.76 26 22.633 26 22.5 L 26 14.5 C 26 14.367 25.947 14.24 25.854 14.146 C 25.76 14.053 25.633 14 25.5 14 L 20.5 14 C 20.367 14 20.24 13.947 20.146 13.854 C 20.053 13.76 20 13.633 20 13.5 C 20 13.367 20.053 13.24 20.146 13.146 C 20.24 13.053 20.367 13 20.5 13 L 25.5 13 C 25.898 13 26.279 13.158 26.561 13.439 C 26.842 13.721 27 14.102 27 14.5 Z M 13.146 13.854 C 13.193 13.9 13.248 13.937 13.309 13.962 C 13.369 13.987 13.434 14 13.5 14 C 13.566 14 13.631 13.987 13.691 13.962 C 13.752 13.937 13.807 13.9 13.854 13.854 L 19.854 7.854 C 19.9 7.807 19.937 7.752 19.962 7.691 C 19.987 7.631 20 7.566 20 7.5 C 20 7.434 19.987 7.369 19.962 7.309 C 19.937 7.248 19.9 7.193 19.854 7.146 C 19.807 7.1 19.752 7.063 19.691 7.038 C 19.631 7.013 19.566 7 19.5 7 C 19.434 7 19.369 7.013 19.309 7.038 C 19.248 7.063 19.193 7.1 19.146 7.146 L 14 12.292 L 14 0.5 C 14 0.367 13.947 0.24 13.854 0.146 C 13.76 0.053 13.633 0 13.5 0 C 13.367 0 13.24 0.053 13.146 0.146 C 13.053 0.24 13 0.367 13 0.5 L 13 12.292 L 7.854 7.146 C 7.76 7.052 7.633 7 7.5 7 C 7.367 7 7.24 7.052 7.146 7.146 C 7.052 7.24 7 7.367 7 7.5 C 7 7.633 7.052 7.76 7.146 7.854 L 13.146 13.854 Z M 22 18.5 C 22 18.302 21.941 18.109 21.831 17.944 C 21.722 17.78 21.565 17.652 21.383 17.576 C 21.2 17.5 20.999 17.481 20.805 17.519 C 20.611 17.558 20.433 17.653 20.293 17.793 C 20.153 17.933 20.058 18.111 20.019 18.305 C 19.981 18.499 20 18.7 20.076 18.883 C 20.152 19.065 20.28 19.222 20.444 19.331 C 20.609 19.441 20.802 19.5 21 19.5 C 21.265 19.5 21.52 19.395 21.707 19.207 C 21.895 19.02 22 18.765 22 18.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.500 2.500)\"/>"
    },
    "EyeClosedWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 26.806 8.742 C 26.904 8.913 26.968 9.102 26.993 9.298 C 27.019 9.494 27.006 9.692 26.954 9.883 C 26.903 10.074 26.815 10.252 26.694 10.409 C 26.574 10.565 26.424 10.696 26.253 10.795 C 26.082 10.893 25.893 10.957 25.697 10.983 C 25.502 11.008 25.303 10.995 25.112 10.944 C 24.922 10.892 24.743 10.804 24.587 10.684 C 24.43 10.563 24.299 10.413 24.201 10.242 L 22.093 6.555 C 20.917 7.295 19.649 7.877 18.322 8.287 L 18.983 12.242 C 19.048 12.635 18.955 13.037 18.723 13.36 C 18.492 13.684 18.142 13.902 17.749 13.967 C 17.667 13.982 17.583 13.989 17.499 13.989 C 17.145 13.988 16.802 13.863 16.532 13.634 C 16.262 13.405 16.081 13.088 16.022 12.739 L 15.378 8.889 C 14.129 9.027 12.869 9.027 11.621 8.889 L 10.983 12.742 C 10.924 13.092 10.743 13.409 10.472 13.638 C 10.201 13.867 9.858 13.993 9.503 13.992 C 9.419 13.993 9.336 13.986 9.253 13.971 C 9.059 13.938 8.873 13.868 8.706 13.763 C 8.539 13.659 8.394 13.522 8.28 13.362 C 8.166 13.201 8.084 13.02 8.04 12.828 C 7.996 12.635 7.99 12.437 8.023 12.242 L 8.684 8.277 C 7.357 7.867 6.089 7.285 4.913 6.545 L 2.806 10.242 C 2.607 10.588 2.279 10.84 1.894 10.944 C 1.509 11.047 1.098 10.994 0.753 10.795 C 0.408 10.596 0.155 10.268 0.052 9.883 C -0.052 9.498 0.002 9.088 0.201 8.742 L 2.503 4.724 C 1.723 4.019 0.999 3.254 0.339 2.435 C 0.106 2.124 0.003 1.735 0.051 1.35 C 0.099 0.965 0.294 0.613 0.596 0.369 C 0.898 0.124 1.283 0.007 1.67 0.041 C 2.057 0.075 2.415 0.257 2.671 0.55 C 4.676 3.032 8.183 5.992 13.503 5.992 C 18.823 5.992 22.331 3.032 24.336 0.55 C 24.586 0.243 24.948 0.049 25.342 0.008 C 25.736 -0.033 26.131 0.084 26.439 0.333 C 26.747 0.582 26.944 0.943 26.987 1.336 C 27.03 1.73 26.916 2.125 26.669 2.435 C 26.009 3.254 25.284 4.019 24.503 4.724 L 26.806 8.742 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.497 11.508)\"/>"
    },
    "EyeClosedWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 6 C 21.899 8.601 18.046 12 12 12 C 5.954 12 2.101 8.601 0 6 C 2.101 3.399 5.954 0 12 0 C 18.046 0 21.899 3.399 24 6 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 7)\"/><path d=\"M 25.535 9.929 C 25.421 9.995 25.295 10.036 25.164 10.053 C 25.034 10.069 24.902 10.06 24.775 10.025 C 24.648 9.99 24.529 9.931 24.426 9.85 C 24.322 9.769 24.235 9.669 24.17 9.554 L 21.795 5.404 C 20.414 6.338 18.891 7.041 17.285 7.487 L 18.019 11.889 C 18.04 12.019 18.036 12.152 18.007 12.28 C 17.977 12.408 17.923 12.529 17.846 12.635 C 17.77 12.742 17.673 12.833 17.562 12.903 C 17.45 12.972 17.326 13.019 17.196 13.041 C 17.143 13.049 17.089 13.054 17.035 13.054 C 16.799 13.054 16.57 12.97 16.389 12.817 C 16.209 12.664 16.089 12.452 16.05 12.218 L 15.329 7.896 C 13.808 8.107 12.265 8.107 10.744 7.896 L 10.023 12.218 C 9.984 12.452 9.863 12.664 9.682 12.818 C 9.501 12.971 9.272 13.055 9.035 13.054 C 8.98 13.054 8.925 13.05 8.87 13.041 C 8.74 13.019 8.616 12.972 8.505 12.903 C 8.393 12.833 8.297 12.742 8.22 12.635 C 8.144 12.529 8.089 12.408 8.06 12.28 C 8.03 12.152 8.026 12.019 8.048 11.889 L 8.785 7.487 C 7.18 7.04 5.657 6.335 4.278 5.401 L 1.91 9.554 C 1.777 9.785 1.559 9.954 1.301 10.024 C 1.044 10.094 0.77 10.058 0.539 9.926 C 0.308 9.793 0.139 9.574 0.069 9.317 C 0 9.06 0.035 8.785 0.168 8.554 L 2.668 4.179 C 1.789 3.421 0.982 2.584 0.255 1.679 C 0.164 1.578 0.095 1.46 0.052 1.331 C 0.009 1.202 -0.008 1.066 0.003 0.93 C 0.014 0.795 0.053 0.663 0.117 0.543 C 0.181 0.423 0.268 0.317 0.374 0.232 C 0.48 0.147 0.602 0.085 0.733 0.048 C 0.864 0.012 1.001 0.003 1.136 0.021 C 1.27 0.04 1.4 0.086 1.516 0.156 C 1.633 0.226 1.733 0.319 1.813 0.429 C 3.888 2.997 7.518 6.054 13.035 6.054 C 18.553 6.054 22.183 2.993 24.258 0.429 C 24.336 0.317 24.437 0.221 24.553 0.149 C 24.67 0.077 24.8 0.03 24.936 0.01 C 25.072 -0.009 25.21 -0.001 25.343 0.035 C 25.475 0.072 25.598 0.135 25.705 0.221 C 25.812 0.307 25.9 0.414 25.964 0.535 C 26.028 0.657 26.066 0.79 26.076 0.927 C 26.086 1.064 26.068 1.201 26.023 1.33 C 25.977 1.46 25.906 1.579 25.813 1.679 C 25.086 2.584 24.278 3.421 23.4 4.179 L 25.9 8.554 C 25.967 8.668 26.011 8.795 26.029 8.926 C 26.047 9.057 26.039 9.19 26.005 9.318 C 25.971 9.446 25.912 9.566 25.831 9.671 C 25.751 9.776 25.65 9.864 25.535 9.929 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.965 11.946)\"/>"
    },
    "EyeClosedWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25.87 14.5 C 26.003 14.73 26.038 15.004 25.969 15.26 C 25.9 15.517 25.732 15.736 25.502 15.868 C 25.388 15.934 25.262 15.976 25.131 15.993 C 25.001 16.01 24.869 16.002 24.741 15.967 C 24.485 15.898 24.266 15.73 24.134 15.5 L 21.759 11.35 C 20.379 12.283 18.857 12.987 17.252 13.433 L 17.986 17.835 C 18.008 17.965 18.004 18.097 17.974 18.225 C 17.944 18.353 17.89 18.474 17.813 18.581 C 17.737 18.688 17.64 18.779 17.529 18.848 C 17.417 18.918 17.293 18.965 17.164 18.986 C 17.11 18.995 17.056 19 17.002 19 C 16.766 19 16.537 18.915 16.357 18.762 C 16.176 18.609 16.056 18.397 16.017 18.164 L 15.296 13.841 C 13.775 14.053 12.232 14.053 10.711 13.841 L 9.99 18.164 C 9.951 18.398 9.83 18.61 9.65 18.763 C 9.469 18.916 9.239 19 9.002 19 C 8.947 19 8.892 18.995 8.837 18.986 C 8.708 18.965 8.584 18.918 8.472 18.848 C 8.361 18.779 8.264 18.688 8.188 18.581 C 8.111 18.474 8.057 18.353 8.027 18.225 C 7.997 18.097 7.993 17.965 8.015 17.835 L 8.752 13.433 C 7.147 12.985 5.625 12.281 4.245 11.346 L 1.877 15.5 C 1.745 15.731 1.526 15.9 1.269 15.97 C 1.011 16.039 0.737 16.004 0.506 15.871 C 0.275 15.739 0.106 15.52 0.037 15.263 C -0.033 15.005 0.002 14.731 0.135 14.5 L 2.635 10.125 C 1.756 9.367 0.949 8.53 0.222 7.625 C 0.078 7.447 0 7.225 0 6.996 C 0 6.767 0.078 6.545 0.222 6.368 C 2.572 3.465 6.696 0 13.002 0 C 19.309 0 23.432 3.465 25.78 6.375 C 25.924 6.553 26.002 6.775 26.002 7.004 C 26.002 7.233 25.924 7.455 25.78 7.632 C 25.053 8.537 24.246 9.374 23.367 10.132 L 25.87 14.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.998 6)\"/>"
    },
    "EyeClosedWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25.403 8.378 C 25.502 8.55 25.529 8.756 25.477 8.948 C 25.425 9.141 25.299 9.305 25.127 9.404 C 24.954 9.503 24.749 9.53 24.556 9.478 C 24.364 9.427 24.2 9.3 24.1 9.128 L 21.6 4.743 C 20.122 5.779 18.471 6.545 16.725 7.004 L 17.497 11.629 C 17.513 11.726 17.51 11.826 17.488 11.922 C 17.465 12.018 17.425 12.108 17.367 12.189 C 17.31 12.269 17.238 12.337 17.154 12.389 C 17.07 12.441 16.977 12.477 16.88 12.493 C 16.839 12.499 16.797 12.502 16.755 12.503 C 16.578 12.503 16.407 12.44 16.272 12.325 C 16.136 12.211 16.046 12.052 16.017 11.878 L 15.252 7.308 C 13.595 7.568 11.908 7.568 10.252 7.308 L 9.492 11.878 C 9.462 12.053 9.371 12.211 9.236 12.326 C 9.1 12.44 8.929 12.503 8.752 12.503 C 8.71 12.502 8.668 12.499 8.627 12.493 C 8.529 12.476 8.436 12.441 8.353 12.389 C 8.269 12.336 8.197 12.268 8.14 12.188 C 8.083 12.107 8.042 12.017 8.02 11.92 C 7.998 11.824 7.995 11.725 8.012 11.628 L 8.783 7.003 C 7.037 6.543 5.386 5.778 3.908 4.741 L 1.403 9.128 C 1.303 9.3 1.139 9.427 0.947 9.478 C 0.754 9.53 0.549 9.503 0.377 9.404 C 0.204 9.305 0.078 9.141 0.026 8.948 C -0.026 8.756 0.001 8.55 0.1 8.378 L 2.707 3.818 C 1.779 3.035 0.929 2.166 0.168 1.221 C 0.043 1.067 -0.016 0.869 0.006 0.671 C 0.027 0.473 0.125 0.291 0.28 0.166 C 0.435 0.041 0.633 -0.017 0.831 0.004 C 1.029 0.025 1.21 0.124 1.335 0.279 C 3.444 2.891 7.135 6.003 12.752 6.003 C 18.368 6.003 22.059 2.891 24.168 0.281 C 24.293 0.127 24.474 0.028 24.672 0.007 C 24.87 -0.014 25.068 0.044 25.223 0.169 C 25.378 0.294 25.476 0.475 25.497 0.673 C 25.519 0.871 25.46 1.069 25.335 1.224 C 24.574 2.168 23.724 3.038 22.797 3.82 L 25.403 8.378 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.248 12.247)\"/>"
    },
    "EyeClosedWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25.535 9.929 C 25.421 9.995 25.295 10.036 25.164 10.053 C 25.034 10.069 24.902 10.06 24.775 10.025 C 24.648 9.99 24.529 9.931 24.426 9.85 C 24.322 9.769 24.235 9.669 24.17 9.554 L 21.795 5.404 C 20.414 6.338 18.891 7.041 17.285 7.487 L 18.019 11.889 C 18.04 12.019 18.036 12.152 18.007 12.28 C 17.977 12.408 17.923 12.529 17.846 12.635 C 17.77 12.742 17.673 12.833 17.562 12.903 C 17.45 12.972 17.326 13.019 17.196 13.041 C 17.143 13.049 17.089 13.054 17.035 13.054 C 16.799 13.054 16.57 12.97 16.389 12.817 C 16.209 12.664 16.089 12.452 16.05 12.218 L 15.329 7.896 C 13.808 8.107 12.265 8.107 10.744 7.896 L 10.023 12.218 C 9.984 12.452 9.863 12.664 9.682 12.818 C 9.501 12.971 9.272 13.055 9.035 13.054 C 8.98 13.054 8.925 13.05 8.87 13.041 C 8.74 13.019 8.616 12.972 8.505 12.903 C 8.393 12.833 8.297 12.742 8.22 12.635 C 8.144 12.529 8.089 12.408 8.06 12.28 C 8.03 12.152 8.026 12.019 8.048 11.889 L 8.785 7.487 C 7.18 7.04 5.657 6.335 4.278 5.401 L 1.91 9.554 C 1.777 9.785 1.559 9.954 1.301 10.024 C 1.044 10.094 0.77 10.058 0.539 9.926 C 0.308 9.793 0.139 9.574 0.069 9.317 C 0 9.06 0.035 8.785 0.168 8.554 L 2.668 4.179 C 1.789 3.421 0.982 2.584 0.255 1.679 C 0.164 1.578 0.095 1.46 0.052 1.331 C 0.009 1.202 -0.008 1.066 0.003 0.93 C 0.014 0.795 0.053 0.663 0.117 0.543 C 0.181 0.423 0.268 0.317 0.374 0.232 C 0.48 0.147 0.602 0.085 0.733 0.048 C 0.864 0.012 1.001 0.003 1.136 0.021 C 1.27 0.04 1.4 0.086 1.516 0.156 C 1.633 0.226 1.733 0.319 1.813 0.429 C 3.888 2.997 7.518 6.054 13.035 6.054 C 18.553 6.054 22.183 2.993 24.258 0.429 C 24.336 0.317 24.437 0.221 24.553 0.149 C 24.67 0.077 24.8 0.03 24.936 0.01 C 25.072 -0.009 25.21 -0.001 25.343 0.035 C 25.475 0.072 25.598 0.135 25.705 0.221 C 25.812 0.307 25.9 0.414 25.964 0.535 C 26.028 0.657 26.066 0.79 26.076 0.927 C 26.086 1.064 26.068 1.201 26.023 1.33 C 25.977 1.46 25.906 1.579 25.813 1.679 C 25.086 2.584 24.278 3.421 23.4 4.179 L 25.9 8.554 C 25.967 8.668 26.011 8.795 26.029 8.926 C 26.047 9.057 26.039 9.19 26.005 9.318 C 25.971 9.446 25.912 9.566 25.831 9.671 C 25.751 9.776 25.65 9.864 25.535 9.929 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.965 11.946)\"/>"
    },
    "EyeClosedWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24.772 8.962 C 24.696 9.006 24.61 9.029 24.522 9.028 C 24.434 9.029 24.348 9.006 24.271 8.962 C 24.195 8.918 24.132 8.855 24.088 8.778 L 21.444 4.153 C 19.873 5.299 18.094 6.128 16.206 6.595 L 17.022 11.446 C 17.044 11.577 17.012 11.711 16.935 11.819 C 16.858 11.926 16.741 11.999 16.611 12.021 C 16.583 12.026 16.555 12.028 16.527 12.028 C 16.409 12.028 16.294 11.986 16.204 11.91 C 16.114 11.833 16.054 11.728 16.034 11.611 L 15.233 6.798 C 13.443 7.105 11.613 7.105 9.823 6.798 L 9.022 11.611 C 9.002 11.729 8.941 11.836 8.849 11.912 C 8.757 11.989 8.641 12.03 8.522 12.028 C 8.494 12.028 8.466 12.026 8.438 12.021 C 8.307 11.999 8.191 11.926 8.113 11.819 C 8.036 11.711 8.005 11.577 8.027 11.446 L 8.837 6.592 C 6.949 6.126 5.171 5.298 3.599 4.153 L 0.956 8.778 C 0.912 8.855 0.848 8.918 0.772 8.962 C 0.696 9.006 0.61 9.029 0.522 9.028 C 0.434 9.029 0.348 9.006 0.272 8.962 C 0.215 8.929 0.165 8.886 0.125 8.834 C 0.085 8.781 0.055 8.722 0.038 8.658 C 0.021 8.595 0.017 8.529 0.025 8.463 C 0.034 8.398 0.055 8.335 0.088 8.278 L 2.798 3.536 C 1.82 2.731 0.927 1.828 0.133 0.841 C 0.087 0.791 0.051 0.731 0.028 0.666 C 0.005 0.602 -0.004 0.533 0.001 0.465 C 0.006 0.396 0.025 0.33 0.057 0.269 C 0.089 0.208 0.133 0.155 0.187 0.112 C 0.24 0.069 0.302 0.037 0.368 0.019 C 0.434 0.001 0.503 -0.003 0.571 0.006 C 0.639 0.016 0.704 0.04 0.763 0.076 C 0.821 0.112 0.871 0.16 0.911 0.216 C 3.053 2.867 6.808 6.028 12.522 6.028 C 18.236 6.028 21.991 2.867 24.133 0.215 C 24.172 0.158 24.223 0.111 24.281 0.075 C 24.339 0.039 24.404 0.015 24.472 0.005 C 24.54 -0.005 24.609 0 24.676 0.018 C 24.742 0.036 24.804 0.067 24.857 0.11 C 24.91 0.153 24.954 0.207 24.986 0.268 C 25.018 0.328 25.037 0.395 25.042 0.463 C 25.047 0.532 25.038 0.6 25.016 0.665 C 24.993 0.73 24.957 0.789 24.911 0.84 C 24.117 1.827 23.224 2.73 22.246 3.535 L 24.956 8.278 C 24.989 8.335 25.01 8.398 25.018 8.463 C 25.027 8.529 25.023 8.595 25.006 8.658 C 24.989 8.722 24.959 8.781 24.919 8.834 C 24.879 8.886 24.829 8.929 24.772 8.962 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.478 12.472)\"/>"
    },
    "EyeOpen": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 22.435 7.196 C 22.402 7.122 21.608 5.361 19.843 3.595 C 17.491 1.243 14.52 0 11.25 0 C 7.98 0 5.009 1.243 2.657 3.595 C 0.892 5.361 0.094 7.125 0.065 7.196 C 0.022 7.292 0 7.396 0 7.501 C 0 7.606 0.022 7.71 0.065 7.806 C 0.097 7.88 0.892 9.64 2.657 11.406 C 5.009 13.757 7.98 15 11.25 15 C 14.52 15 17.491 13.757 19.843 11.406 C 21.608 9.64 22.402 7.88 22.435 7.806 C 22.478 7.71 22.5 7.606 22.5 7.501 C 22.5 7.396 22.478 7.292 22.435 7.196 Z M 11.25 13.5 C 8.364 13.5 5.843 12.451 3.757 10.383 C 2.9 9.531 2.172 8.56 1.594 7.5 C 2.172 6.44 2.9 5.469 3.757 4.617 C 5.843 2.549 8.364 1.5 11.25 1.5 C 14.136 1.5 16.657 2.549 18.743 4.617 C 19.601 5.468 20.331 6.439 20.911 7.5 C 20.235 8.762 17.29 13.5 11.25 13.5 Z M 11.25 3 C 10.36 3 9.49 3.264 8.75 3.758 C 8.01 4.253 7.433 4.956 7.093 5.778 C 6.752 6.6 6.663 7.505 6.836 8.378 C 7.01 9.251 7.439 10.053 8.068 10.682 C 8.697 11.311 9.499 11.74 10.372 11.914 C 11.245 12.087 12.15 11.998 12.972 11.657 C 13.794 11.317 14.497 10.74 14.992 10 C 15.486 9.26 15.75 8.39 15.75 7.5 C 15.749 6.307 15.274 5.163 14.431 4.319 C 13.587 3.476 12.443 3.001 11.25 3 Z M 11.25 10.5 C 10.657 10.5 10.077 10.324 9.583 9.994 C 9.09 9.665 8.705 9.196 8.478 8.648 C 8.251 8.1 8.192 7.497 8.308 6.915 C 8.423 6.333 8.709 5.798 9.129 5.379 C 9.548 4.959 10.083 4.673 10.665 4.558 C 11.247 4.442 11.85 4.501 12.398 4.728 C 12.946 4.955 13.415 5.34 13.744 5.833 C 14.074 6.327 14.25 6.907 14.25 7.5 C 14.25 8.296 13.934 9.059 13.371 9.621 C 12.809 10.184 12.046 10.5 11.25 10.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0.750 4.500)\"/>"
    },
    "FileWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22.561 7.44 L 15.561 0.44 C 15.422 0.301 15.257 0.19 15.074 0.114 C 14.892 0.039 14.697 0 14.5 0 L 2.5 0 C 1.837 0 1.201 0.263 0.732 0.732 C 0.263 1.201 0 1.837 0 2.5 L 0 24.5 C 0 25.163 0.263 25.799 0.732 26.268 C 1.201 26.737 1.837 27 2.5 27 L 20.5 27 C 21.163 27 21.799 26.737 22.268 26.268 C 22.737 25.799 23 25.163 23 24.5 L 23 8.5 C 23 8.102 22.842 7.721 22.561 7.44 Z M 15.5 4.625 L 18.375 7.5 L 15.5 7.5 L 15.5 4.625 Z M 3 24 L 3 3 L 12.5 3 L 12.5 9 C 12.5 9.398 12.658 9.779 12.939 10.061 C 13.221 10.342 13.602 10.5 14 10.5 L 20 10.5 L 20 24 L 3 24 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 2.500)\"/>"
    },
    "FileWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 7 7 L 0 7 L 0 0 L 7 7 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 19 4)\"/><path d=\"M 21.708 7.293 L 14.708 0.293 C 14.615 0.2 14.504 0.126 14.383 0.076 C 14.261 0.026 14.131 0 14 0 L 2 0 C 1.47 0 0.961 0.211 0.586 0.586 C 0.211 0.961 0 1.47 0 2 L 0 24 C 0 24.53 0.211 25.039 0.586 25.414 C 0.961 25.789 1.47 26 2 26 L 20 26 C 20.53 26 21.039 25.789 21.414 25.414 C 21.789 25.039 22 24.53 22 24 L 22 8 C 22 7.869 21.974 7.739 21.924 7.617 C 21.874 7.496 21.8 7.385 21.708 7.293 Z M 15 3.414 L 18.586 7 L 15 7 L 15 3.414 Z M 20 24 L 2 24 L 2 2 L 13 2 L 13 8 C 13 8.265 13.105 8.52 13.293 8.707 C 13.48 8.895 13.735 9 14 9 L 20 9 L 20 24 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 3)\"/>"
    },
    "FileWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 21.708 7.293 L 14.708 0.293 C 14.615 0.2 14.504 0.126 14.383 0.076 C 14.261 0.026 14.131 0 14 0 L 2 0 C 1.47 0 0.961 0.211 0.586 0.586 C 0.211 0.961 0 1.47 0 2 L 0 24 C 0 24.53 0.211 25.039 0.586 25.414 C 0.961 25.789 1.47 26 2 26 L 20 26 C 20.53 26 21.039 25.789 21.414 25.414 C 21.789 25.039 22 24.53 22 24 L 22 8 C 22 7.869 21.974 7.739 21.924 7.617 C 21.874 7.496 21.8 7.385 21.708 7.293 Z M 14 8 L 14 2.5 L 19.5 8 L 14 8 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 3)\"/>"
    },
    "FileWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 21.28 7.22 L 14.28 0.22 C 14.139 0.079 13.949 0 13.75 0 L 1.75 0 C 1.286 0 0.841 0.184 0.513 0.513 C 0.184 0.841 0 1.286 0 1.75 L 0 23.75 C 0 24.214 0.184 24.659 0.513 24.987 C 0.841 25.316 1.286 25.5 1.75 25.5 L 19.75 25.5 C 20.214 25.5 20.659 25.316 20.987 24.987 C 21.316 24.659 21.5 24.214 21.5 23.75 L 21.5 7.75 C 21.5 7.551 21.421 7.361 21.28 7.22 Z M 14.5 2.56 L 18.94 7 L 14.5 7 L 14.5 2.56 Z M 19.75 24 L 1.75 24 C 1.684 24 1.62 23.974 1.573 23.927 C 1.526 23.88 1.5 23.816 1.5 23.75 L 1.5 1.75 C 1.5 1.684 1.526 1.62 1.573 1.573 C 1.62 1.526 1.684 1.5 1.75 1.5 L 13 1.5 L 13 7.75 C 13 7.949 13.079 8.14 13.22 8.28 C 13.36 8.421 13.551 8.5 13.75 8.5 L 20 8.5 L 20 23.75 C 20 23.816 19.974 23.88 19.927 23.927 C 19.88 23.974 19.816 24 19.75 24 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.250 3.250)\"/>"
    },
    "FileWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 21.708 7.293 L 14.708 0.293 C 14.615 0.2 14.504 0.126 14.383 0.076 C 14.261 0.026 14.131 0 14 0 L 2 0 C 1.47 0 0.961 0.211 0.586 0.586 C 0.211 0.961 0 1.47 0 2 L 0 24 C 0 24.53 0.211 25.039 0.586 25.414 C 0.961 25.789 1.47 26 2 26 L 20 26 C 20.53 26 21.039 25.789 21.414 25.414 C 21.789 25.039 22 24.53 22 24 L 22 8 C 22 7.869 21.974 7.739 21.924 7.617 C 21.874 7.496 21.8 7.385 21.708 7.293 Z M 15 3.414 L 18.586 7 L 15 7 L 15 3.414 Z M 20 24 L 2 24 L 2 2 L 13 2 L 13 8 C 13 8.265 13.105 8.52 13.293 8.707 C 13.48 8.895 13.735 9 14 9 L 20 9 L 20 24 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 3)\"/>"
    },
    "FileWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 20.854 7.146 L 13.854 0.146 C 13.807 0.1 13.752 0.063 13.691 0.038 C 13.631 0.013 13.566 0 13.5 0 L 1.5 0 C 1.102 0 0.721 0.158 0.439 0.439 C 0.158 0.721 0 1.102 0 1.5 L 0 23.5 C 0 23.898 0.158 24.279 0.439 24.561 C 0.721 24.842 1.102 25 1.5 25 L 19.5 25 C 19.898 25 20.279 24.842 20.561 24.561 C 20.842 24.279 21 23.898 21 23.5 L 21 7.5 C 21 7.434 20.987 7.369 20.962 7.309 C 20.937 7.248 20.9 7.193 20.854 7.146 Z M 14 1.706 L 19.292 7 L 14 7 L 14 1.706 Z M 19.5 24 L 1.5 24 C 1.367 24 1.24 23.947 1.146 23.854 C 1.053 23.76 1 23.633 1 23.5 L 1 1.5 C 1 1.367 1.053 1.24 1.146 1.146 C 1.24 1.053 1.367 1 1.5 1 L 13 1 L 13 7.5 C 13 7.633 13.053 7.76 13.146 7.854 C 13.24 7.947 13.367 8 13.5 8 L 20 8 L 20 23.5 C 20 23.633 19.947 23.76 19.854 23.854 C 19.76 23.947 19.633 24 19.5 24 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.500 3.500)\"/>"
    },
    "GearWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13.579 7.083 C 12.294 7.083 11.037 7.464 9.968 8.178 C 8.899 8.892 8.066 9.908 7.574 11.095 C 7.082 12.283 6.953 13.59 7.204 14.851 C 7.455 16.112 8.074 17.27 8.983 18.179 C 9.892 19.088 11.05 19.707 12.311 19.958 C 13.572 20.209 14.879 20.08 16.067 19.588 C 17.254 19.096 18.27 18.263 18.984 17.194 C 19.698 16.125 20.079 14.868 20.079 13.583 C 20.077 11.859 19.392 10.207 18.173 8.989 C 16.955 7.77 15.303 7.085 13.579 7.083 Z M 13.579 17.083 C 12.887 17.083 12.21 16.878 11.635 16.493 C 11.059 16.108 10.611 15.562 10.346 14.922 C 10.081 14.283 10.011 13.579 10.147 12.9 C 10.282 12.221 10.615 11.597 11.104 11.108 C 11.594 10.618 12.218 10.285 12.896 10.15 C 13.575 10.015 14.279 10.084 14.919 10.349 C 15.558 10.614 16.105 11.063 16.489 11.638 C 16.874 12.214 17.079 12.891 17.079 13.583 C 17.079 14.511 16.711 15.401 16.054 16.058 C 15.398 16.714 14.508 17.083 13.579 17.083 Z M 25.079 13.682 L 25.079 13.484 L 26.829 11.295 C 26.976 11.112 27.078 10.897 27.126 10.667 C 27.175 10.437 27.168 10.199 27.108 9.972 C 26.792 8.78 26.32 7.636 25.704 6.569 C 25.586 6.366 25.421 6.193 25.223 6.065 C 25.025 5.937 24.8 5.857 24.566 5.833 L 21.781 5.52 L 21.642 5.382 L 21.329 2.595 C 21.304 2.361 21.225 2.136 21.097 1.939 C 20.969 1.741 20.796 1.576 20.593 1.458 C 19.526 0.84 18.381 0.366 17.189 0.049 C 16.962 -0.011 16.724 -0.016 16.494 0.033 C 16.265 0.083 16.05 0.185 15.867 0.333 L 13.678 2.083 L 13.481 2.083 L 11.292 0.333 C 11.108 0.186 10.893 0.084 10.663 0.036 C 10.433 -0.013 10.195 -0.006 9.968 0.054 C 8.777 0.372 7.632 0.846 6.566 1.464 C 6.363 1.582 6.191 1.746 6.063 1.943 C 5.935 2.139 5.855 2.363 5.829 2.597 L 5.517 5.382 L 5.378 5.52 L 2.592 5.833 C 2.358 5.858 2.133 5.937 1.935 6.065 C 1.738 6.193 1.573 6.366 1.454 6.569 C 0.838 7.637 0.366 8.781 0.051 9.973 C -0.01 10.2 -0.016 10.438 0.032 10.667 C 0.081 10.897 0.183 11.112 0.329 11.295 L 2.079 13.484 L 2.079 13.682 L 0.329 15.87 C 0.182 16.054 0.081 16.269 0.032 16.499 C -0.016 16.729 -0.01 16.967 0.051 17.194 C 0.369 18.386 0.843 19.53 1.462 20.597 C 1.58 20.799 1.743 20.971 1.94 21.099 C 2.136 21.227 2.36 21.307 2.593 21.333 L 5.378 21.643 L 5.517 21.782 L 5.829 24.57 C 5.854 24.804 5.934 25.029 6.062 25.227 C 6.19 25.425 6.362 25.589 6.566 25.708 C 7.633 26.326 8.777 26.799 9.969 27.117 C 10.197 27.176 10.435 27.181 10.664 27.132 C 10.894 27.083 11.109 26.98 11.292 26.833 L 13.481 25.083 L 13.678 25.083 L 15.867 26.833 C 16.05 26.98 16.266 27.081 16.495 27.13 C 16.725 27.178 16.963 27.172 17.191 27.112 C 18.382 26.796 19.526 26.324 20.593 25.708 C 20.796 25.59 20.969 25.426 21.097 25.229 C 21.226 25.033 21.306 24.809 21.332 24.575 L 21.642 21.79 L 21.781 21.652 L 24.567 21.333 C 24.8 21.307 25.024 21.227 25.221 21.098 C 25.418 20.97 25.582 20.797 25.699 20.594 C 26.317 19.527 26.791 18.382 27.108 17.19 C 27.168 16.964 27.174 16.726 27.125 16.497 C 27.077 16.268 26.976 16.053 26.829 15.87 L 25.079 13.682 Z M 22.064 13.07 C 22.084 13.412 22.084 13.754 22.064 14.095 C 22.042 14.466 22.158 14.833 22.391 15.123 L 23.996 17.129 C 23.844 17.577 23.663 18.016 23.454 18.44 L 20.901 18.724 C 20.531 18.766 20.19 18.945 19.944 19.224 C 19.717 19.48 19.475 19.722 19.219 19.949 C 18.94 20.195 18.762 20.536 18.719 20.905 L 18.437 23.458 C 18.012 23.668 17.574 23.849 17.126 24.002 L 15.119 22.395 C 14.853 22.183 14.522 22.067 14.182 22.068 C 14.152 22.068 14.122 22.068 14.092 22.068 C 13.75 22.088 13.408 22.088 13.067 22.068 C 12.696 22.046 12.33 22.162 12.039 22.393 L 10.033 23.999 C 9.585 23.848 9.147 23.667 8.722 23.458 L 8.438 20.904 C 8.396 20.534 8.218 20.193 7.938 19.948 C 7.682 19.721 7.44 19.479 7.213 19.223 C 6.967 18.943 6.627 18.765 6.257 18.723 L 3.704 18.44 C 3.494 18.016 3.313 17.578 3.161 17.129 L 4.766 15.123 C 4.998 14.833 5.114 14.466 5.092 14.095 C 5.072 13.754 5.072 13.412 5.092 13.07 C 5.114 12.699 4.998 12.333 4.766 12.043 L 3.163 10.037 C 3.315 9.588 3.495 9.15 3.704 8.725 L 6.258 8.442 C 6.628 8.399 6.969 8.221 7.214 7.942 C 7.441 7.686 7.683 7.444 7.939 7.217 C 8.219 6.971 8.397 6.63 8.439 6.26 L 8.722 3.708 C 9.146 3.498 9.584 3.316 10.033 3.164 L 12.039 4.77 C 12.33 5.002 12.696 5.117 13.067 5.095 C 13.408 5.075 13.75 5.075 14.092 5.095 C 14.463 5.118 14.829 5.002 15.119 4.77 L 17.126 3.164 C 17.574 3.316 18.012 3.498 18.437 3.708 L 18.721 6.262 C 18.763 6.631 18.941 6.972 19.221 7.218 C 19.476 7.445 19.718 7.687 19.946 7.943 C 20.191 8.222 20.532 8.401 20.902 8.443 L 23.454 8.725 C 23.664 9.15 23.846 9.588 23.998 10.037 L 22.393 12.043 C 22.16 12.333 22.043 12.699 22.064 13.07 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.421 2.417)\"/>"
    },
    "GearWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22.06 11.477 L 24.157 8.852 C 23.875 7.789 23.451 6.768 22.899 5.816 L 19.561 5.441 C 19.295 5.141 19.01 4.857 18.71 4.59 L 18.335 1.251 C 17.382 0.702 16.361 0.282 15.297 0.001 L 12.672 2.097 C 12.271 2.074 11.869 2.074 11.468 2.097 L 8.843 0 C 7.782 0.284 6.765 0.707 5.816 1.259 L 5.441 4.596 C 5.141 4.863 4.857 5.147 4.59 5.448 L 1.251 5.823 C 0.702 6.775 0.282 7.797 0.001 8.86 L 2.098 11.485 C 2.074 11.886 2.074 12.289 2.098 12.69 L 0 15.315 C 0.283 16.378 0.706 17.4 1.259 18.351 L 4.596 18.726 C 4.863 19.027 5.147 19.311 5.448 19.577 L 5.823 22.916 C 6.775 23.465 7.797 23.886 8.86 24.166 L 11.485 22.07 C 11.886 22.094 12.289 22.094 12.69 22.07 L 15.315 24.167 C 16.378 23.885 17.4 23.461 18.351 22.909 L 18.726 19.571 C 19.027 19.305 19.311 19.02 19.577 18.72 L 22.916 18.345 C 23.465 17.392 23.886 16.371 24.166 15.308 L 22.07 12.683 C 22.09 12.281 22.087 11.879 22.06 11.477 Z M 12.078 17.08 C 11.089 17.08 10.122 16.787 9.3 16.237 C 8.477 15.688 7.837 14.907 7.458 13.993 C 7.08 13.08 6.981 12.074 7.174 11.105 C 7.366 10.135 7.843 9.244 8.542 8.544 C 9.241 7.845 10.132 7.369 11.102 7.176 C 12.072 6.983 13.077 7.082 13.991 7.461 C 14.905 7.839 15.685 8.48 16.235 9.302 C 16.784 10.124 17.077 11.091 17.077 12.08 C 17.077 13.406 16.551 14.678 15.613 15.616 C 14.675 16.553 13.404 17.08 12.078 17.08 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.922 3.920)\"/><path d=\"M 13.08 7.08 C 11.893 7.08 10.733 7.432 9.747 8.091 C 8.76 8.751 7.991 9.688 7.537 10.784 C 7.083 11.88 6.964 13.087 7.195 14.251 C 7.427 15.415 7.998 16.484 8.837 17.323 C 9.677 18.162 10.746 18.733 11.91 18.965 C 13.073 19.196 14.28 19.078 15.376 18.623 C 16.473 18.169 17.41 17.4 18.069 16.414 C 18.728 15.427 19.08 14.267 19.08 13.08 C 19.078 11.489 18.446 9.964 17.321 8.839 C 16.196 7.714 14.671 7.082 13.08 7.08 Z M 13.08 17.08 C 12.289 17.08 11.516 16.846 10.858 16.406 C 10.2 15.966 9.687 15.342 9.385 14.611 C 9.082 13.88 9.003 13.076 9.157 12.3 C 9.311 11.524 9.692 10.811 10.252 10.252 C 10.811 9.692 11.524 9.311 12.3 9.157 C 13.076 9.003 13.88 9.082 14.611 9.385 C 15.342 9.687 15.966 10.2 16.406 10.858 C 16.846 11.516 17.08 12.289 17.08 13.08 C 17.08 14.141 16.659 15.158 15.909 15.909 C 15.158 16.659 14.141 17.08 13.08 17.08 Z M 24.08 13.35 C 24.085 13.17 24.085 12.99 24.08 12.81 L 25.945 10.48 C 26.043 10.358 26.111 10.214 26.143 10.061 C 26.175 9.908 26.171 9.749 26.13 9.598 C 25.824 8.449 25.367 7.345 24.77 6.316 C 24.692 6.182 24.583 6.067 24.453 5.982 C 24.323 5.897 24.175 5.843 24.02 5.825 L 21.055 5.495 C 20.932 5.365 20.807 5.24 20.68 5.12 L 20.33 2.148 C 20.312 1.993 20.258 1.845 20.173 1.714 C 20.087 1.584 19.972 1.476 19.838 1.398 C 18.809 0.802 17.705 0.345 16.556 0.04 C 16.405 0 16.246 -0.005 16.093 0.028 C 15.94 0.06 15.796 0.127 15.674 0.225 L 13.35 2.08 C 13.17 2.08 12.99 2.08 12.81 2.08 L 10.48 0.219 C 10.358 0.121 10.214 0.053 10.061 0.021 C 9.908 -0.011 9.749 -0.007 9.598 0.034 C 8.449 0.34 7.345 0.797 6.316 1.394 C 6.182 1.472 6.067 1.581 5.982 1.711 C 5.897 1.841 5.843 1.989 5.825 2.144 L 5.495 5.114 C 5.365 5.238 5.24 5.363 5.12 5.489 L 2.148 5.83 C 1.993 5.848 1.845 5.902 1.714 5.988 C 1.584 6.073 1.476 6.188 1.398 6.323 C 0.802 7.352 0.345 8.455 0.039 9.604 C -0.001 9.755 -0.005 9.914 0.027 10.067 C 0.059 10.221 0.127 10.364 0.225 10.486 L 2.08 12.81 C 2.08 12.99 2.08 13.17 2.08 13.35 L 0.219 15.68 C 0.121 15.802 0.053 15.946 0.021 16.099 C -0.011 16.253 -0.007 16.411 0.034 16.563 C 0.34 17.712 0.797 18.815 1.394 19.844 C 1.472 19.978 1.581 20.093 1.711 20.178 C 1.841 20.264 1.989 20.317 2.144 20.335 L 5.109 20.665 C 5.233 20.795 5.358 20.92 5.484 21.04 L 5.83 24.013 C 5.848 24.167 5.902 24.316 5.988 24.446 C 6.073 24.576 6.188 24.685 6.323 24.763 C 7.352 25.358 8.455 25.815 9.604 26.121 C 9.755 26.162 9.914 26.166 10.067 26.133 C 10.221 26.101 10.364 26.033 10.486 25.935 L 12.81 24.08 C 12.99 24.085 13.17 24.085 13.35 24.08 L 15.68 25.945 C 15.802 26.043 15.946 26.111 16.099 26.143 C 16.253 26.175 16.411 26.171 16.563 26.13 C 17.712 25.824 18.815 25.367 19.844 24.77 C 19.978 24.692 20.093 24.583 20.178 24.453 C 20.264 24.323 20.317 24.175 20.335 24.02 L 20.665 21.055 C 20.795 20.932 20.92 20.807 21.04 20.68 L 24.013 20.33 C 24.167 20.312 24.316 20.258 24.446 20.173 C 24.576 20.087 24.685 19.972 24.763 19.838 C 25.358 18.809 25.815 17.705 26.121 16.556 C 26.162 16.405 26.166 16.246 26.133 16.093 C 26.101 15.94 26.033 15.796 25.935 15.674 L 24.08 13.35 Z M 22.068 12.538 C 22.089 12.899 22.089 13.261 22.068 13.623 C 22.053 13.87 22.13 14.114 22.285 14.308 L 24.059 16.524 C 23.855 17.171 23.595 17.798 23.28 18.399 L 20.455 18.719 C 20.209 18.746 19.982 18.864 19.818 19.049 C 19.577 19.319 19.321 19.576 19.05 19.816 C 18.865 19.981 18.747 20.208 18.72 20.454 L 18.406 23.276 C 17.806 23.591 17.178 23.852 16.531 24.055 L 14.314 22.281 C 14.136 22.14 13.916 22.062 13.689 22.063 L 13.629 22.063 C 13.268 22.084 12.905 22.084 12.544 22.063 C 12.297 22.048 12.053 22.126 11.859 22.28 L 9.636 24.055 C 8.99 23.852 8.362 23.591 7.761 23.276 L 7.441 20.455 C 7.414 20.209 7.296 19.982 7.111 19.818 C 6.841 19.577 6.584 19.321 6.344 19.05 C 6.18 18.865 5.952 18.747 5.706 18.72 L 2.884 18.405 C 2.569 17.805 2.309 17.177 2.105 16.53 L 3.879 14.313 C 4.034 14.119 4.111 13.875 4.096 13.628 C 4.075 13.266 4.075 12.904 4.096 12.543 C 4.111 12.295 4.034 12.051 3.879 11.858 L 2.105 9.636 C 2.309 8.99 2.569 8.362 2.884 7.761 L 5.705 7.441 C 5.951 7.414 6.178 7.296 6.343 7.111 C 6.583 6.841 6.84 6.584 7.11 6.344 C 7.296 6.179 7.414 5.952 7.441 5.705 L 7.755 2.884 C 8.356 2.569 8.983 2.309 9.63 2.105 L 11.848 3.879 C 12.041 4.034 12.285 4.111 12.533 4.096 C 12.894 4.075 13.256 4.075 13.618 4.096 C 13.865 4.111 14.109 4.033 14.303 3.879 L 16.524 2.105 C 17.171 2.309 17.798 2.569 18.399 2.884 L 18.719 5.705 C 18.746 5.951 18.864 6.178 19.049 6.343 C 19.319 6.583 19.576 6.84 19.816 7.11 C 19.981 7.295 20.208 7.413 20.454 7.44 L 23.276 7.754 C 23.591 8.355 23.852 8.982 24.055 9.629 L 22.281 11.846 C 22.125 12.042 22.047 12.288 22.064 12.538 L 22.068 12.538 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.920 2.920)\"/>"
    },
    "GearWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24.08 13.35 C 24.085 13.17 24.085 12.99 24.08 12.81 L 25.945 10.48 C 26.043 10.358 26.111 10.214 26.143 10.061 C 26.175 9.908 26.171 9.749 26.13 9.598 C 25.824 8.449 25.367 7.345 24.77 6.316 C 24.692 6.182 24.583 6.067 24.453 5.982 C 24.323 5.897 24.175 5.843 24.02 5.825 L 21.055 5.495 C 20.932 5.365 20.807 5.24 20.68 5.12 L 20.33 2.148 C 20.312 1.993 20.258 1.845 20.173 1.714 C 20.087 1.584 19.972 1.476 19.838 1.398 C 18.809 0.802 17.705 0.345 16.556 0.04 C 16.405 0 16.246 -0.005 16.093 0.028 C 15.94 0.06 15.796 0.127 15.674 0.225 L 13.35 2.08 C 13.17 2.08 12.99 2.08 12.81 2.08 L 10.48 0.219 C 10.358 0.121 10.214 0.053 10.061 0.021 C 9.908 -0.011 9.749 -0.007 9.598 0.034 C 8.449 0.34 7.345 0.797 6.316 1.394 C 6.182 1.472 6.067 1.581 5.982 1.711 C 5.897 1.841 5.843 1.989 5.825 2.144 L 5.495 5.114 C 5.365 5.238 5.24 5.363 5.12 5.489 L 2.148 5.83 C 1.993 5.848 1.845 5.902 1.714 5.988 C 1.584 6.073 1.476 6.188 1.398 6.323 C 0.802 7.352 0.345 8.455 0.039 9.604 C -0.001 9.755 -0.005 9.914 0.027 10.067 C 0.059 10.221 0.127 10.364 0.225 10.486 L 2.08 12.81 C 2.08 12.99 2.08 13.17 2.08 13.35 L 0.219 15.68 C 0.121 15.802 0.053 15.946 0.021 16.099 C -0.011 16.253 -0.007 16.411 0.034 16.563 C 0.34 17.712 0.797 18.815 1.394 19.844 C 1.472 19.978 1.581 20.093 1.711 20.178 C 1.841 20.264 1.989 20.317 2.144 20.335 L 5.109 20.665 C 5.233 20.795 5.358 20.92 5.484 21.04 L 5.83 24.013 C 5.848 24.167 5.902 24.316 5.988 24.446 C 6.073 24.576 6.188 24.685 6.323 24.763 C 7.352 25.358 8.455 25.815 9.604 26.121 C 9.755 26.162 9.914 26.166 10.067 26.133 C 10.221 26.101 10.364 26.033 10.486 25.935 L 12.81 24.08 C 12.99 24.085 13.17 24.085 13.35 24.08 L 15.68 25.945 C 15.802 26.043 15.946 26.111 16.099 26.143 C 16.253 26.175 16.411 26.171 16.563 26.13 C 17.712 25.824 18.815 25.367 19.844 24.77 C 19.978 24.692 20.093 24.583 20.178 24.453 C 20.264 24.323 20.317 24.175 20.335 24.02 L 20.665 21.055 C 20.795 20.932 20.92 20.807 21.04 20.68 L 24.013 20.33 C 24.167 20.312 24.316 20.258 24.446 20.173 C 24.576 20.087 24.685 19.972 24.763 19.838 C 25.358 18.809 25.815 17.705 26.121 16.556 C 26.162 16.405 26.166 16.246 26.133 16.093 C 26.101 15.94 26.033 15.796 25.935 15.674 L 24.08 13.35 Z M 13.08 18.08 C 12.091 18.08 11.125 17.787 10.302 17.237 C 9.48 16.688 8.839 15.907 8.461 14.994 C 8.082 14.08 7.983 13.075 8.176 12.105 C 8.369 11.135 8.845 10.244 9.545 9.545 C 10.244 8.845 11.135 8.369 12.105 8.176 C 13.075 7.983 14.08 8.082 14.994 8.461 C 15.907 8.839 16.688 9.48 17.237 10.302 C 17.787 11.125 18.08 12.091 18.08 13.08 C 18.08 14.406 17.553 15.678 16.616 16.616 C 15.678 17.553 14.406 18.08 13.08 18.08 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.920 2.920)\"/>"
    },
    "GearWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 12.83 7.082 C 11.693 7.082 10.581 7.419 9.636 8.051 C 8.69 8.683 7.953 9.581 7.518 10.631 C 7.083 11.682 6.969 12.838 7.191 13.954 C 7.413 15.069 7.96 16.094 8.764 16.898 C 9.569 17.702 10.593 18.25 11.709 18.471 C 12.824 18.693 13.98 18.579 15.031 18.144 C 16.081 17.709 16.979 16.972 17.611 16.026 C 18.243 15.081 18.58 13.969 18.58 12.832 C 18.578 11.307 17.972 9.846 16.894 8.768 C 15.816 7.69 14.355 7.084 12.83 7.082 Z M 12.83 17.082 C 11.99 17.082 11.168 16.833 10.469 16.366 C 9.77 15.899 9.225 15.235 8.904 14.458 C 8.582 13.682 8.498 12.827 8.662 12.003 C 8.826 11.178 9.231 10.421 9.825 9.827 C 10.419 9.232 11.177 8.828 12.001 8.664 C 12.826 8.5 13.68 8.584 14.457 8.905 C 15.233 9.227 15.897 9.772 16.364 10.471 C 16.831 11.17 17.08 11.991 17.08 12.832 C 17.08 13.959 16.633 15.04 15.835 15.837 C 15.038 16.634 13.957 17.082 12.83 17.082 Z M 23.58 13.187 C 23.588 12.951 23.588 12.713 23.58 12.477 L 25.497 10.082 C 25.57 9.99 25.62 9.883 25.645 9.768 C 25.669 9.653 25.666 9.534 25.635 9.421 C 25.335 8.291 24.887 7.206 24.3 6.194 C 24.242 6.092 24.16 6.004 24.062 5.939 C 23.964 5.874 23.851 5.833 23.734 5.819 L 20.678 5.481 C 20.517 5.308 20.35 5.141 20.178 4.981 L 19.838 1.923 C 19.824 1.806 19.783 1.693 19.718 1.595 C 19.653 1.497 19.565 1.415 19.463 1.357 C 18.453 0.772 17.369 0.324 16.242 0.024 C 16.128 -0.005 16.009 -0.008 15.894 0.017 C 15.779 0.042 15.672 0.093 15.58 0.167 L 13.18 2.088 C 12.944 2.081 12.707 2.081 12.47 2.088 L 10.08 0.166 C 9.989 0.092 9.881 0.042 9.766 0.018 C 9.651 -0.007 9.532 -0.003 9.419 0.027 C 8.289 0.327 7.204 0.776 6.193 1.362 C 6.09 1.42 6.003 1.502 5.938 1.6 C 5.872 1.698 5.831 1.811 5.818 1.928 L 5.484 4.984 C 5.312 5.146 5.145 5.313 4.984 5.484 L 1.925 5.832 C 1.808 5.845 1.696 5.886 1.597 5.952 C 1.499 6.017 1.417 6.104 1.359 6.207 C 0.774 7.217 0.326 8.3 0.027 9.428 C -0.002 9.54 -0.005 9.658 0.019 9.771 C 0.043 9.885 0.093 9.991 0.165 10.082 L 2.087 12.482 C 2.079 12.718 2.079 12.956 2.087 13.192 L 0.164 15.588 C 0.091 15.68 0.04 15.787 0.016 15.902 C -0.008 16.017 -0.005 16.136 0.025 16.249 C 0.326 17.377 0.775 18.46 1.36 19.469 C 1.419 19.572 1.5 19.659 1.599 19.725 C 1.697 19.79 1.809 19.831 1.927 19.844 L 4.983 20.183 C 5.144 20.356 5.311 20.522 5.483 20.683 L 5.83 23.737 C 5.844 23.854 5.885 23.966 5.95 24.065 C 6.015 24.163 6.103 24.245 6.205 24.303 C 7.215 24.888 8.299 25.336 9.427 25.636 C 9.54 25.666 9.659 25.669 9.774 25.645 C 9.889 25.621 9.996 25.57 10.088 25.497 L 12.475 23.582 C 12.712 23.589 12.949 23.589 13.185 23.582 L 15.587 25.504 C 15.72 25.611 15.885 25.668 16.055 25.668 C 16.12 25.668 16.185 25.659 16.248 25.643 C 17.376 25.343 18.458 24.894 19.468 24.308 C 19.57 24.25 19.658 24.168 19.723 24.07 C 19.788 23.971 19.829 23.859 19.843 23.742 L 20.182 20.686 C 20.354 20.525 20.521 20.358 20.682 20.186 L 23.739 19.846 C 23.856 19.832 23.969 19.791 24.067 19.726 C 24.165 19.661 24.247 19.573 24.305 19.471 C 24.89 18.461 25.338 17.377 25.638 16.249 C 25.668 16.136 25.671 16.017 25.647 15.902 C 25.623 15.787 25.572 15.68 25.499 15.588 L 23.58 13.187 Z M 23.193 18.391 L 20.238 18.719 C 20.053 18.741 19.883 18.83 19.76 18.969 C 19.513 19.248 19.25 19.511 18.972 19.758 C 18.832 19.881 18.743 20.051 18.722 20.236 L 18.393 23.189 C 17.701 23.558 16.974 23.857 16.223 24.082 L 13.902 22.224 C 13.768 22.118 13.603 22.06 13.433 22.061 L 13.388 22.061 C 13.016 22.082 12.644 22.082 12.273 22.061 C 12.087 22.049 11.904 22.107 11.759 22.223 L 9.439 24.082 C 8.688 23.856 7.962 23.556 7.272 23.186 L 6.943 20.233 C 6.922 20.048 6.832 19.878 6.693 19.756 C 6.414 19.509 6.151 19.245 5.904 18.967 C 5.781 18.827 5.611 18.738 5.427 18.717 L 2.473 18.388 C 2.104 17.698 1.805 16.973 1.58 16.224 L 3.438 13.903 C 3.554 13.758 3.612 13.575 3.6 13.389 C 3.579 13.018 3.579 12.646 3.6 12.274 C 3.612 12.089 3.554 11.906 3.438 11.761 L 1.58 9.441 C 1.806 8.69 2.106 7.964 2.477 7.273 L 5.429 6.944 C 5.614 6.923 5.784 6.834 5.907 6.694 C 6.154 6.416 6.417 6.153 6.695 5.906 C 6.835 5.783 6.924 5.613 6.945 5.428 L 7.274 2.474 C 7.964 2.106 8.689 1.807 9.438 1.582 L 11.759 3.439 C 11.904 3.555 12.087 3.613 12.273 3.602 C 12.644 3.581 13.016 3.581 13.388 3.602 C 13.573 3.613 13.756 3.555 13.902 3.439 L 16.222 1.582 C 16.972 1.808 17.698 2.108 18.389 2.478 L 18.718 5.433 C 18.739 5.618 18.828 5.788 18.968 5.911 C 19.246 6.158 19.509 6.421 19.757 6.699 C 19.879 6.839 20.049 6.928 20.234 6.949 L 23.188 7.278 C 23.556 7.967 23.855 8.691 24.08 9.439 L 22.223 11.761 C 22.107 11.906 22.049 12.089 22.06 12.274 C 22.082 12.646 22.082 13.018 22.06 13.389 C 22.049 13.575 22.107 13.758 22.223 13.903 L 24.08 16.223 C 23.855 16.974 23.556 17.7 23.187 18.391 L 23.193 18.391 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.170 3.168)\"/>"
    },
    "GearWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13.08 7.08 C 11.893 7.08 10.733 7.432 9.747 8.091 C 8.76 8.751 7.991 9.688 7.537 10.784 C 7.083 11.88 6.964 13.087 7.195 14.251 C 7.427 15.415 7.998 16.484 8.837 17.323 C 9.677 18.162 10.746 18.733 11.91 18.965 C 13.073 19.196 14.28 19.078 15.376 18.623 C 16.473 18.169 17.41 17.4 18.069 16.414 C 18.728 15.427 19.08 14.267 19.08 13.08 C 19.078 11.489 18.446 9.964 17.321 8.839 C 16.196 7.714 14.671 7.082 13.08 7.08 Z M 13.08 17.08 C 12.289 17.08 11.516 16.846 10.858 16.406 C 10.2 15.966 9.687 15.342 9.385 14.611 C 9.082 13.88 9.003 13.076 9.157 12.3 C 9.311 11.524 9.692 10.811 10.252 10.252 C 10.811 9.692 11.524 9.311 12.3 9.157 C 13.076 9.003 13.88 9.082 14.611 9.385 C 15.342 9.687 15.966 10.2 16.406 10.858 C 16.846 11.516 17.08 12.289 17.08 13.08 C 17.08 14.141 16.659 15.158 15.909 15.909 C 15.158 16.659 14.141 17.08 13.08 17.08 Z M 24.08 13.35 C 24.085 13.17 24.085 12.99 24.08 12.81 L 25.945 10.48 C 26.043 10.358 26.111 10.214 26.143 10.061 C 26.175 9.908 26.171 9.749 26.13 9.598 C 25.824 8.448 25.367 7.345 24.77 6.316 C 24.692 6.182 24.583 6.067 24.453 5.982 C 24.323 5.897 24.175 5.843 24.02 5.825 L 21.055 5.495 C 20.932 5.365 20.807 5.24 20.68 5.12 L 20.33 2.148 C 20.312 1.993 20.258 1.845 20.173 1.714 C 20.087 1.584 19.972 1.476 19.838 1.398 C 18.809 0.802 17.705 0.345 16.556 0.039 C 16.405 -0.001 16.246 -0.005 16.093 0.027 C 15.94 0.059 15.796 0.127 15.674 0.225 L 13.35 2.08 C 13.17 2.08 12.99 2.08 12.81 2.08 L 10.48 0.219 C 10.358 0.121 10.214 0.053 10.061 0.021 C 9.908 -0.011 9.749 -0.007 9.598 0.034 C 8.449 0.34 7.345 0.797 6.316 1.394 C 6.182 1.472 6.067 1.581 5.982 1.711 C 5.897 1.841 5.843 1.989 5.825 2.144 L 5.495 5.114 C 5.365 5.238 5.24 5.363 5.12 5.489 L 2.148 5.83 C 1.993 5.848 1.845 5.902 1.714 5.988 C 1.584 6.073 1.476 6.188 1.398 6.323 C 0.802 7.352 0.345 8.455 0.039 9.604 C -0.001 9.755 -0.005 9.914 0.027 10.067 C 0.059 10.221 0.127 10.364 0.225 10.486 L 2.08 12.81 C 2.08 12.99 2.08 13.17 2.08 13.35 L 0.219 15.68 C 0.121 15.802 0.053 15.946 0.021 16.099 C -0.011 16.253 -0.007 16.411 0.034 16.563 C 0.34 17.712 0.797 18.815 1.394 19.844 C 1.472 19.978 1.581 20.093 1.711 20.178 C 1.841 20.264 1.989 20.317 2.144 20.335 L 5.109 20.665 C 5.233 20.795 5.358 20.92 5.484 21.04 L 5.83 24.013 C 5.848 24.167 5.902 24.316 5.988 24.446 C 6.073 24.576 6.188 24.685 6.323 24.763 C 7.352 25.358 8.455 25.815 9.604 26.121 C 9.755 26.162 9.914 26.166 10.067 26.133 C 10.221 26.101 10.364 26.033 10.486 25.935 L 12.81 24.08 C 12.99 24.085 13.17 24.085 13.35 24.08 L 15.68 25.945 C 15.802 26.043 15.946 26.111 16.099 26.143 C 16.253 26.175 16.411 26.171 16.563 26.13 C 17.712 25.824 18.815 25.367 19.844 24.77 C 19.978 24.692 20.093 24.583 20.178 24.453 C 20.264 24.323 20.317 24.175 20.335 24.02 L 20.665 21.055 C 20.795 20.932 20.92 20.807 21.04 20.68 L 24.013 20.33 C 24.167 20.312 24.316 20.258 24.446 20.173 C 24.576 20.087 24.685 19.972 24.763 19.838 C 25.358 18.809 25.815 17.705 26.121 16.556 C 26.162 16.405 26.166 16.246 26.133 16.093 C 26.101 15.94 26.033 15.796 25.935 15.674 L 24.08 13.35 Z M 22.068 12.538 C 22.089 12.899 22.089 13.261 22.068 13.623 C 22.053 13.87 22.13 14.114 22.285 14.308 L 24.059 16.524 C 23.855 17.171 23.595 17.798 23.28 18.399 L 20.455 18.719 C 20.209 18.746 19.982 18.864 19.818 19.049 C 19.577 19.319 19.321 19.576 19.05 19.816 C 18.865 19.981 18.747 20.208 18.72 20.454 L 18.406 23.276 C 17.806 23.591 17.178 23.852 16.531 24.055 L 14.314 22.281 C 14.136 22.14 13.916 22.062 13.689 22.063 L 13.629 22.063 C 13.268 22.084 12.905 22.084 12.544 22.063 C 12.296 22.048 12.052 22.125 11.859 22.28 L 9.636 24.055 C 8.99 23.852 8.362 23.591 7.761 23.276 L 7.441 20.455 C 7.414 20.209 7.296 19.982 7.111 19.818 C 6.841 19.577 6.584 19.321 6.344 19.05 C 6.18 18.865 5.952 18.747 5.706 18.72 L 2.884 18.405 C 2.569 17.805 2.309 17.177 2.105 16.53 L 3.879 14.313 C 4.034 14.119 4.111 13.875 4.096 13.628 C 4.075 13.266 4.075 12.904 4.096 12.543 C 4.111 12.295 4.034 12.051 3.879 11.858 L 2.105 9.636 C 2.309 8.99 2.569 8.362 2.884 7.761 L 5.705 7.441 C 5.951 7.414 6.178 7.296 6.343 7.111 C 6.583 6.841 6.84 6.584 7.11 6.344 C 7.296 6.179 7.414 5.952 7.441 5.705 L 7.755 2.884 C 8.356 2.569 8.983 2.309 9.63 2.105 L 11.848 3.879 C 12.041 4.034 12.285 4.111 12.533 4.096 C 12.894 4.075 13.256 4.075 13.618 4.096 C 13.865 4.111 14.109 4.034 14.303 3.879 L 16.524 2.105 C 17.171 2.309 17.798 2.569 18.399 2.884 L 18.719 5.705 C 18.746 5.951 18.864 6.178 19.049 6.343 C 19.319 6.583 19.576 6.84 19.816 7.11 C 19.981 7.295 20.208 7.413 20.454 7.44 L 23.276 7.754 C 23.591 8.355 23.852 8.982 24.055 9.629 L 22.281 11.846 C 22.125 12.042 22.047 12.288 22.064 12.538 L 22.068 12.538 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.920 2.920)\"/>"
    },
    "GearWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 12.58 7.08 C 11.493 7.08 10.429 7.403 9.525 8.007 C 8.62 8.612 7.915 9.471 7.499 10.476 C 7.083 11.481 6.974 12.586 7.186 13.653 C 7.398 14.72 7.922 15.7 8.691 16.469 C 9.46 17.239 10.44 17.762 11.507 17.975 C 12.574 18.187 13.68 18.078 14.685 17.662 C 15.69 17.245 16.549 16.54 17.153 15.636 C 17.758 14.732 18.08 13.668 18.08 12.58 C 18.079 11.122 17.499 9.724 16.468 8.693 C 15.437 7.662 14.039 7.082 12.58 7.08 Z M 12.58 17.08 C 11.69 17.08 10.82 16.816 10.08 16.322 C 9.34 15.828 8.764 15.125 8.423 14.302 C 8.082 13.48 7.993 12.575 8.167 11.702 C 8.34 10.83 8.769 10.028 9.398 9.398 C 10.028 8.769 10.83 8.34 11.702 8.167 C 12.575 7.993 13.48 8.082 14.302 8.423 C 15.125 8.764 15.828 9.34 16.322 10.08 C 16.816 10.82 17.08 11.69 17.08 12.58 C 17.08 13.774 16.606 14.918 15.762 15.762 C 14.918 16.606 13.774 17.08 12.58 17.08 Z M 23.072 13.019 C 23.082 12.727 23.082 12.435 23.072 12.144 L 25.05 9.67 C 25.099 9.609 25.134 9.538 25.15 9.461 C 25.166 9.384 25.164 9.305 25.144 9.229 C 24.848 8.122 24.406 7.059 23.83 6.068 C 23.792 6 23.738 5.942 23.673 5.898 C 23.608 5.855 23.533 5.827 23.455 5.818 L 20.307 5.468 C 20.109 5.254 19.902 5.047 19.688 4.849 L 19.339 1.705 C 19.33 1.628 19.302 1.553 19.259 1.488 C 19.215 1.423 19.157 1.369 19.089 1.33 C 18.099 0.756 17.038 0.315 15.933 0.018 C 15.857 -0.002 15.778 -0.004 15.701 0.012 C 15.625 0.028 15.553 0.061 15.492 0.11 L 13.019 2.089 C 12.727 2.077 12.435 2.077 12.144 2.089 L 9.668 0.11 C 9.607 0.061 9.535 0.027 9.458 0.011 C 9.382 -0.005 9.302 -0.003 9.227 0.017 C 8.12 0.313 7.058 0.755 6.068 1.33 C 6 1.369 5.942 1.423 5.898 1.488 C 5.855 1.553 5.827 1.628 5.818 1.705 L 5.468 4.854 C 5.254 5.052 5.047 5.259 4.849 5.473 L 1.705 5.822 C 1.628 5.831 1.553 5.859 1.488 5.902 C 1.423 5.945 1.369 6.004 1.33 6.072 C 0.756 7.061 0.315 8.123 0.018 9.228 C -0.002 9.304 -0.004 9.383 0.012 9.46 C 0.028 9.536 0.061 9.608 0.11 9.669 L 2.089 12.142 C 2.077 12.434 2.077 12.726 2.089 13.017 L 0.11 15.493 C 0.061 15.554 0.027 15.626 0.011 15.702 C -0.005 15.779 -0.003 15.858 0.017 15.934 C 0.313 17.04 0.755 18.103 1.33 19.093 C 1.369 19.161 1.423 19.219 1.488 19.263 C 1.553 19.306 1.628 19.333 1.705 19.343 L 4.854 19.693 C 5.052 19.907 5.259 20.114 5.473 20.312 L 5.823 23.462 C 5.832 23.539 5.86 23.614 5.903 23.679 C 5.947 23.744 6.005 23.798 6.073 23.837 C 7.064 24.41 8.127 24.849 9.233 25.144 C 9.309 25.164 9.388 25.167 9.465 25.15 C 9.541 25.134 9.613 25.101 9.674 25.052 L 12.147 23.073 C 12.439 23.084 12.731 23.084 13.022 23.073 L 15.495 25.052 C 15.584 25.123 15.694 25.162 15.808 25.162 C 15.85 25.162 15.892 25.156 15.933 25.145 C 17.04 24.849 18.102 24.407 19.093 23.83 C 19.161 23.792 19.219 23.738 19.263 23.673 C 19.306 23.608 19.333 23.533 19.343 23.455 L 19.693 20.307 C 19.907 20.109 20.114 19.902 20.312 19.688 L 23.462 19.338 C 23.539 19.328 23.614 19.301 23.679 19.258 C 23.744 19.214 23.798 19.156 23.837 19.088 C 24.41 18.097 24.849 17.034 25.144 15.928 C 25.164 15.852 25.167 15.773 25.15 15.696 C 25.134 15.62 25.101 15.548 25.052 15.487 L 23.072 13.019 Z M 23.093 18.373 L 20.009 18.715 C 19.886 18.729 19.773 18.788 19.69 18.88 C 19.437 19.166 19.166 19.437 18.88 19.69 C 18.788 19.773 18.729 19.886 18.715 20.009 L 18.373 23.092 C 17.595 23.522 16.772 23.863 15.918 24.11 L 13.495 22.172 C 13.407 22.101 13.296 22.063 13.183 22.063 L 13.153 22.063 C 12.772 22.087 12.389 22.087 12.008 22.063 C 11.884 22.055 11.762 22.094 11.665 22.172 L 9.244 24.109 C 8.39 23.863 7.566 23.522 6.788 23.093 L 6.445 20.009 C 6.432 19.886 6.373 19.773 6.28 19.69 C 5.994 19.437 5.724 19.166 5.47 18.88 C 5.388 18.788 5.275 18.729 5.152 18.715 L 2.069 18.373 C 1.639 17.595 1.297 16.772 1.05 15.918 L 2.989 13.495 C 3.067 13.399 3.105 13.277 3.098 13.153 C 3.075 12.772 3.075 12.389 3.098 12.008 C 3.105 11.884 3.067 11.762 2.989 11.665 L 1.052 9.244 C 1.298 8.39 1.639 7.566 2.068 6.788 L 5.152 6.445 C 5.275 6.432 5.388 6.373 5.47 6.28 C 5.724 5.994 5.994 5.724 6.28 5.47 C 6.373 5.388 6.432 5.275 6.445 5.152 L 6.788 2.069 C 7.566 1.639 8.389 1.297 9.243 1.05 L 11.665 2.989 C 11.762 3.067 11.884 3.105 12.008 3.098 C 12.389 3.074 12.772 3.074 13.153 3.098 C 13.277 3.105 13.399 3.067 13.495 2.989 L 15.917 1.052 C 16.771 1.298 17.595 1.639 18.373 2.068 L 18.715 5.152 C 18.729 5.275 18.788 5.388 18.88 5.47 C 19.166 5.724 19.437 5.994 19.69 6.28 C 19.773 6.373 19.886 6.432 20.009 6.445 L 23.092 6.788 C 23.522 7.566 23.863 8.389 24.11 9.243 L 22.172 11.665 C 22.094 11.762 22.055 11.884 22.063 12.008 C 22.085 12.389 22.085 12.772 22.063 13.153 C 22.055 13.277 22.094 13.399 22.172 13.495 L 24.109 15.917 C 23.863 16.771 23.522 17.595 23.093 18.373 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.420 3.420)\"/>"
    },
    "Home": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 17.515 7.477 L 10.015 0.401 C 10.012 0.397 10.008 0.394 10.005 0.39 C 9.729 0.139 9.369 0 8.996 0 C 8.623 0 8.263 0.139 7.987 0.39 L 7.976 0.401 L 0.485 7.477 C 0.332 7.617 0.21 7.788 0.126 7.978 C 0.043 8.168 0 8.374 0 8.581 L 0 17.248 C 0 17.646 0.158 18.028 0.439 18.309 C 0.721 18.59 1.102 18.748 1.5 18.748 L 16.5 18.748 C 16.898 18.748 17.279 18.59 17.561 18.309 C 17.842 18.028 18 17.646 18 17.248 L 18 8.581 C 18 8.374 17.957 8.168 17.874 7.978 C 17.79 7.788 17.668 7.617 17.515 7.477 Z M 16.5 17.248 L 1.5 17.248 L 1.5 8.581 L 1.51 8.572 L 9 1.498 L 16.491 8.57 L 16.501 8.579 L 16.5 17.248 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 2.252)\"/>"
    },
    "InfoCircle": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.75 0 C 7.822 0 5.937 0.572 4.333 1.643 C 2.73 2.715 1.48 4.237 0.742 6.019 C 0.004 7.8 -0.189 9.761 0.187 11.652 C 0.564 13.543 1.492 15.281 2.856 16.644 C 4.219 18.008 5.957 18.936 7.848 19.313 C 9.739 19.689 11.7 19.496 13.481 18.758 C 15.263 18.02 16.785 16.77 17.857 15.167 C 18.928 13.563 19.5 11.678 19.5 9.75 C 19.497 7.165 18.469 4.687 16.641 2.859 C 14.813 1.031 12.335 0.003 9.75 0 Z M 9.75 18 C 8.118 18 6.523 17.516 5.167 16.61 C 3.81 15.703 2.752 14.415 2.128 12.907 C 1.504 11.4 1.34 9.741 1.659 8.141 C 1.977 6.54 2.763 5.07 3.916 3.916 C 5.07 2.763 6.54 1.977 8.141 1.659 C 9.741 1.34 11.4 1.504 12.907 2.128 C 14.415 2.752 15.703 3.81 16.61 5.167 C 17.516 6.523 18 8.118 18 9.75 C 17.998 11.937 17.128 14.034 15.581 15.581 C 14.034 17.128 11.937 17.998 9.75 18 Z M 11.25 14.25 C 11.25 14.449 11.171 14.64 11.03 14.78 C 10.89 14.921 10.699 15 10.5 15 C 10.102 15 9.721 14.842 9.439 14.561 C 9.158 14.279 9 13.898 9 13.5 L 9 9.75 C 8.801 9.75 8.61 9.671 8.47 9.53 C 8.329 9.39 8.25 9.199 8.25 9 C 8.25 8.801 8.329 8.61 8.47 8.47 C 8.61 8.329 8.801 8.25 9 8.25 C 9.398 8.25 9.779 8.408 10.061 8.689 C 10.342 8.971 10.5 9.352 10.5 9.75 L 10.5 13.5 C 10.699 13.5 10.89 13.579 11.03 13.72 C 11.171 13.86 11.25 14.051 11.25 14.25 Z M 8.25 5.625 C 8.25 5.402 8.316 5.185 8.44 5 C 8.563 4.815 8.739 4.671 8.944 4.586 C 9.15 4.5 9.376 4.478 9.594 4.522 C 9.813 4.565 10.013 4.672 10.17 4.83 C 10.328 4.987 10.435 5.187 10.478 5.406 C 10.522 5.624 10.5 5.85 10.414 6.056 C 10.329 6.261 10.185 6.437 10 6.56 C 9.815 6.684 9.598 6.75 9.375 6.75 C 9.077 6.75 8.79 6.631 8.58 6.42 C 8.369 6.21 8.25 5.923 8.25 5.625 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "InfoSolid": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.75 0 C 7.822 0 5.937 0.572 4.333 1.643 C 2.73 2.715 1.48 4.237 0.742 6.019 C 0.004 7.8 -0.189 9.761 0.187 11.652 C 0.564 13.543 1.492 15.281 2.856 16.644 C 4.219 18.008 5.957 18.936 7.848 19.313 C 9.739 19.689 11.7 19.496 13.481 18.758 C 15.263 18.02 16.785 16.77 17.857 15.167 C 18.928 13.563 19.5 11.678 19.5 9.75 C 19.497 7.165 18.469 4.687 16.641 2.859 C 14.813 1.031 12.335 0.003 9.75 0 Z M 9.375 4.5 C 9.598 4.5 9.815 4.566 10 4.69 C 10.185 4.813 10.329 4.989 10.414 5.194 C 10.5 5.4 10.522 5.626 10.478 5.844 C 10.435 6.063 10.328 6.263 10.17 6.42 C 10.013 6.578 9.813 6.685 9.594 6.728 C 9.376 6.772 9.15 6.75 8.944 6.664 C 8.739 6.579 8.563 6.435 8.44 6.25 C 8.316 6.065 8.25 5.848 8.25 5.625 C 8.25 5.327 8.369 5.04 8.58 4.83 C 8.79 4.619 9.077 4.5 9.375 4.5 Z M 10.5 15 C 10.102 15 9.721 14.842 9.439 14.561 C 9.158 14.279 9 13.898 9 13.5 L 9 9.75 C 8.801 9.75 8.61 9.671 8.47 9.53 C 8.329 9.39 8.25 9.199 8.25 9 C 8.25 8.801 8.329 8.61 8.47 8.47 C 8.61 8.329 8.801 8.25 9 8.25 C 9.398 8.25 9.779 8.408 10.061 8.689 C 10.342 8.971 10.5 9.352 10.5 9.75 L 10.5 13.5 C 10.699 13.5 10.89 13.579 11.03 13.72 C 11.171 13.86 11.25 14.051 11.25 14.25 C 11.25 14.449 11.171 14.64 11.03 14.78 C 10.89 14.921 10.699 15 10.5 15 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "InfoWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 11 8 C 11 7.604 11.117 7.218 11.337 6.889 C 11.557 6.56 11.869 6.304 12.235 6.152 C 12.6 6.001 13.002 5.961 13.39 6.038 C 13.778 6.116 14.135 6.306 14.414 6.586 C 14.694 6.865 14.884 7.222 14.962 7.61 C 15.039 7.998 14.999 8.4 14.848 8.765 C 14.696 9.131 14.44 9.443 14.111 9.663 C 13.782 9.883 13.396 10 13 10 C 12.47 10 11.961 9.789 11.586 9.414 C 11.211 9.039 11 8.53 11 8 Z M 27 13.5 C 27 16.17 26.208 18.78 24.725 21 C 23.241 23.22 21.133 24.951 18.666 25.972 C 16.199 26.994 13.485 27.262 10.866 26.741 C 8.248 26.22 5.842 24.934 3.954 23.046 C 2.066 21.158 0.78 18.752 0.259 16.134 C -0.261 13.515 0.006 10.801 1.028 8.334 C 2.049 5.867 3.78 3.759 6 2.275 C 8.22 0.792 10.83 0 13.5 0 C 17.079 0.004 20.511 1.428 23.042 3.958 C 25.572 6.489 26.996 9.921 27 13.5 Z M 24 13.5 C 24 11.423 23.384 9.393 22.23 7.667 C 21.077 5.94 19.437 4.594 17.518 3.799 C 15.6 3.005 13.488 2.797 11.452 3.202 C 9.415 3.607 7.544 4.607 6.075 6.075 C 4.607 7.544 3.607 9.415 3.202 11.452 C 2.797 13.488 3.005 15.6 3.799 17.518 C 4.594 19.437 5.94 21.077 7.667 22.23 C 9.393 23.384 11.423 24 13.5 24 C 16.284 23.997 18.953 22.89 20.921 20.921 C 22.89 18.953 23.997 16.284 24 13.5 Z M 15 18.085 L 15 14 C 15 13.337 14.737 12.701 14.268 12.232 C 13.799 11.763 13.163 11.5 12.5 11.5 C 12.146 11.499 11.803 11.624 11.532 11.852 C 11.261 12.081 11.079 12.397 11.019 12.746 C 10.959 13.096 11.025 13.455 11.205 13.76 C 11.384 14.065 11.666 14.297 12 14.415 L 12 18.5 C 12 19.163 12.263 19.799 12.732 20.268 C 13.201 20.737 13.837 21 14.5 21 C 14.854 21.001 15.197 20.876 15.468 20.648 C 15.739 20.419 15.921 20.103 15.981 19.754 C 16.041 19.404 15.975 19.045 15.795 18.74 C 15.616 18.435 15.334 18.203 15 18.085 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.500 2.500)\"/>"
    },
    "InfoWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 12 C 24 14.373 23.296 16.693 21.978 18.667 C 20.659 20.64 18.785 22.178 16.592 23.087 C 14.399 23.995 11.987 24.232 9.659 23.769 C 7.331 23.306 5.193 22.164 3.515 20.485 C 1.836 18.807 0.694 16.669 0.231 14.341 C -0.232 12.013 0.005 9.601 0.913 7.408 C 1.822 5.215 3.36 3.341 5.333 2.022 C 7.307 0.704 9.627 0 12 0 C 15.183 0 18.235 1.264 20.485 3.515 C 22.736 5.765 24 8.817 24 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/><path d=\"M 15 19 C 15 19.265 14.895 19.52 14.707 19.707 C 14.52 19.895 14.265 20 14 20 C 13.47 20 12.961 19.789 12.586 19.414 C 12.211 19.039 12 18.53 12 18 L 12 13 C 11.735 13 11.48 12.895 11.293 12.707 C 11.105 12.52 11 12.265 11 12 C 11 11.735 11.105 11.48 11.293 11.293 C 11.48 11.105 11.735 11 12 11 C 12.53 11 13.039 11.211 13.414 11.586 C 13.789 11.961 14 12.47 14 13 L 14 18 C 14.265 18 14.52 18.105 14.707 18.293 C 14.895 18.48 15 18.735 15 19 Z M 26 13 C 26 15.571 25.238 18.085 23.809 20.222 C 22.381 22.36 20.35 24.026 17.975 25.01 C 15.599 25.994 12.986 26.252 10.464 25.75 C 7.942 25.249 5.626 24.01 3.808 22.192 C 1.99 20.374 0.751 18.058 0.25 15.536 C -0.252 13.014 0.006 10.401 0.99 8.025 C 1.974 5.65 3.64 3.619 5.778 2.191 C 7.915 0.762 10.429 0 13 0 C 16.447 0.004 19.751 1.374 22.188 3.812 C 24.626 6.249 25.996 9.553 26 13 Z M 24 13 C 24 10.824 23.355 8.698 22.146 6.889 C 20.937 5.08 19.22 3.67 17.21 2.837 C 15.2 2.005 12.988 1.787 10.854 2.211 C 8.72 2.636 6.76 3.683 5.222 5.222 C 3.683 6.76 2.636 8.72 2.211 10.854 C 1.787 12.988 2.005 15.2 2.837 17.21 C 3.67 19.22 5.08 20.937 6.889 22.146 C 8.698 23.355 10.824 24 13 24 C 15.916 23.997 18.712 22.837 20.775 20.775 C 22.837 18.712 23.997 15.916 24 13 Z M 12.5 9 C 12.797 9 13.087 8.912 13.333 8.747 C 13.58 8.582 13.772 8.348 13.886 8.074 C 13.999 7.8 14.029 7.498 13.971 7.207 C 13.913 6.916 13.77 6.649 13.561 6.439 C 13.351 6.23 13.084 6.087 12.793 6.029 C 12.502 5.971 12.2 6.001 11.926 6.114 C 11.652 6.228 11.418 6.42 11.253 6.667 C 11.088 6.913 11 7.203 11 7.5 C 11 7.898 11.158 8.279 11.439 8.561 C 11.721 8.842 12.102 9 12.5 9 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "InfoWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 12.5 6 C 12.797 6 13.087 6.088 13.333 6.253 C 13.58 6.418 13.772 6.652 13.886 6.926 C 13.999 7.2 14.029 7.502 13.971 7.793 C 13.913 8.084 13.77 8.351 13.561 8.561 C 13.351 8.77 13.084 8.913 12.793 8.971 C 12.502 9.029 12.2 8.999 11.926 8.886 C 11.652 8.772 11.418 8.58 11.253 8.333 C 11.088 8.087 11 7.797 11 7.5 C 11 7.102 11.158 6.721 11.439 6.439 C 11.721 6.158 12.102 6 12.5 6 Z M 14 20 C 13.47 20 12.961 19.789 12.586 19.414 C 12.211 19.039 12 18.53 12 18 L 12 13 C 11.735 13 11.48 12.895 11.293 12.707 C 11.105 12.52 11 12.265 11 12 C 11 11.735 11.105 11.48 11.293 11.293 C 11.48 11.105 11.735 11 12 11 C 12.53 11 13.039 11.211 13.414 11.586 C 13.789 11.961 14 12.47 14 13 L 14 18 C 14.265 18 14.52 18.105 14.707 18.293 C 14.895 18.48 15 18.735 15 19 C 15 19.265 14.895 19.52 14.707 19.707 C 14.52 19.895 14.265 20 14 20 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "InfoWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 14.5 18.75 C 14.5 18.949 14.421 19.14 14.28 19.28 C 14.14 19.421 13.949 19.5 13.75 19.5 C 13.286 19.5 12.841 19.316 12.513 18.987 C 12.184 18.659 12 18.214 12 17.75 L 12 12.75 C 12 12.684 11.974 12.62 11.927 12.573 C 11.88 12.526 11.816 12.5 11.75 12.5 C 11.551 12.5 11.36 12.421 11.22 12.28 C 11.079 12.14 11 11.949 11 11.75 C 11 11.551 11.079 11.36 11.22 11.22 C 11.36 11.079 11.551 11 11.75 11 C 12.214 11 12.659 11.184 12.987 11.513 C 13.316 11.841 13.5 12.286 13.5 12.75 L 13.5 17.75 C 13.5 17.816 13.526 17.88 13.573 17.927 C 13.62 17.974 13.684 18 13.75 18 C 13.949 18 14.14 18.079 14.28 18.22 C 14.421 18.36 14.5 18.551 14.5 18.75 Z M 12.25 8.5 C 12.497 8.5 12.739 8.427 12.944 8.289 C 13.15 8.152 13.31 7.957 13.405 7.728 C 13.499 7.5 13.524 7.249 13.476 7.006 C 13.428 6.764 13.309 6.541 13.134 6.366 C 12.959 6.191 12.736 6.072 12.494 6.024 C 12.251 5.976 12 6.001 11.772 6.095 C 11.543 6.19 11.348 6.35 11.211 6.556 C 11.073 6.761 11 7.003 11 7.25 C 11 7.582 11.132 7.899 11.366 8.134 C 11.601 8.368 11.918 8.5 12.25 8.5 Z M 25.5 12.75 C 25.5 15.272 24.752 17.737 23.351 19.834 C 21.95 21.93 19.959 23.564 17.629 24.529 C 15.299 25.494 12.736 25.747 10.263 25.255 C 7.789 24.763 5.518 23.549 3.734 21.766 C 1.951 19.982 0.737 17.711 0.245 15.237 C -0.247 12.764 0.006 10.201 0.971 7.871 C 1.936 5.541 3.57 3.55 5.666 2.149 C 7.763 0.748 10.228 0 12.75 0 C 16.13 0.004 19.371 1.349 21.761 3.739 C 24.151 6.129 25.496 9.37 25.5 12.75 Z M 24 12.75 C 24 10.525 23.34 8.35 22.104 6.5 C 20.868 4.65 19.111 3.208 17.055 2.356 C 15 1.505 12.738 1.282 10.555 1.716 C 8.373 2.15 6.368 3.222 4.795 4.795 C 3.222 6.368 2.15 8.373 1.716 10.555 C 1.282 12.738 1.505 15 2.356 17.055 C 3.208 19.111 4.65 20.868 6.5 22.104 C 8.35 23.34 10.525 24 12.75 24 C 15.733 23.997 18.592 22.81 20.701 20.701 C 22.81 18.592 23.997 15.733 24 12.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.250 3.250)\"/>"
    },
    "InfoWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 13 24 C 10.824 24 8.698 23.355 6.889 22.146 C 5.08 20.937 3.67 19.22 2.837 17.21 C 2.005 15.2 1.787 12.988 2.211 10.854 C 2.636 8.72 3.683 6.76 5.222 5.222 C 6.76 3.683 8.72 2.636 10.854 2.211 C 12.988 1.787 15.2 2.005 17.21 2.837 C 19.22 3.67 20.937 5.08 22.146 6.889 C 23.355 8.698 24 10.824 24 13 C 23.997 15.916 22.837 18.712 20.775 20.775 C 18.712 22.837 15.916 23.997 13 24 Z M 15 19 C 15 19.265 14.895 19.52 14.707 19.707 C 14.52 19.895 14.265 20 14 20 C 13.47 20 12.961 19.789 12.586 19.414 C 12.211 19.039 12 18.53 12 18 L 12 13 C 11.735 13 11.48 12.895 11.293 12.707 C 11.105 12.52 11 12.265 11 12 C 11 11.735 11.105 11.48 11.293 11.293 C 11.48 11.105 11.735 11 12 11 C 12.53 11 13.039 11.211 13.414 11.586 C 13.789 11.961 14 12.47 14 13 L 14 18 C 14.265 18 14.52 18.105 14.707 18.293 C 14.895 18.48 15 18.735 15 19 Z M 11 7.5 C 11 7.203 11.088 6.913 11.253 6.667 C 11.418 6.42 11.652 6.228 11.926 6.114 C 12.2 6.001 12.502 5.971 12.793 6.029 C 13.084 6.087 13.351 6.23 13.561 6.439 C 13.77 6.649 13.913 6.916 13.971 7.207 C 14.029 7.498 13.999 7.8 13.886 8.074 C 13.772 8.348 13.58 8.582 13.333 8.747 C 13.087 8.912 12.797 9 12.5 9 C 12.102 9 11.721 8.842 11.439 8.561 C 11.158 8.279 11 7.898 11 7.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "InfoWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 14 18.5 C 14 18.633 13.947 18.76 13.854 18.854 C 13.76 18.947 13.633 19 13.5 19 C 13.102 19 12.721 18.842 12.439 18.561 C 12.158 18.279 12 17.898 12 17.5 L 12 12.5 C 12 12.367 11.947 12.24 11.854 12.146 C 11.76 12.053 11.633 12 11.5 12 C 11.367 12 11.24 11.947 11.146 11.854 C 11.053 11.76 11 11.633 11 11.5 C 11 11.367 11.053 11.24 11.146 11.146 C 11.24 11.053 11.367 11 11.5 11 C 11.898 11 12.279 11.158 12.561 11.439 C 12.842 11.721 13 12.102 13 12.5 L 13 17.5 C 13 17.633 13.053 17.76 13.146 17.854 C 13.24 17.947 13.367 18 13.5 18 C 13.633 18 13.76 18.053 13.854 18.146 C 13.947 18.24 14 18.367 14 18.5 Z M 12 8 C 12.198 8 12.391 7.941 12.556 7.831 C 12.72 7.722 12.848 7.565 12.924 7.383 C 13 7.2 13.019 6.999 12.981 6.805 C 12.942 6.611 12.847 6.433 12.707 6.293 C 12.567 6.153 12.389 6.058 12.195 6.019 C 12.001 5.981 11.8 6 11.617 6.076 C 11.435 6.152 11.278 6.28 11.169 6.444 C 11.059 6.609 11 6.802 11 7 C 11 7.265 11.105 7.52 11.293 7.707 C 11.48 7.895 11.735 8 12 8 Z M 25 12.5 C 25 14.972 24.267 17.389 22.893 19.445 C 21.52 21.5 19.568 23.102 17.284 24.048 C 14.999 24.995 12.486 25.242 10.061 24.76 C 7.637 24.278 5.409 23.087 3.661 21.339 C 1.913 19.591 0.723 17.363 0.24 14.939 C -0.242 12.514 0.005 10.001 0.952 7.716 C 1.898 5.432 3.5 3.48 5.555 2.107 C 7.611 0.733 10.028 0 12.5 0 C 15.814 0.004 18.991 1.322 21.335 3.665 C 23.678 6.009 24.996 9.186 25 12.5 Z M 24 12.5 C 24 10.226 23.326 8.002 22.062 6.111 C 20.798 4.22 19.002 2.746 16.901 1.875 C 14.8 1.005 12.487 0.777 10.256 1.221 C 8.026 1.665 5.977 2.76 4.368 4.368 C 2.76 5.977 1.665 8.026 1.221 10.256 C 0.777 12.487 1.005 14.8 1.875 16.901 C 2.746 19.002 4.22 20.798 6.111 22.062 C 8.002 23.326 10.226 24 12.5 24 C 15.549 23.997 18.472 22.784 20.628 20.628 C 22.784 18.472 23.997 15.549 24 12.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 3.500)\"/>"
    },
    "LightbulbSolid": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 12.75 20.252 C 12.75 20.451 12.671 20.642 12.53 20.783 C 12.39 20.923 12.199 21.002 12 21.002 L 4.5 21.002 C 4.301 21.002 4.11 20.923 3.97 20.783 C 3.829 20.642 3.75 20.451 3.75 20.252 C 3.75 20.053 3.829 19.863 3.97 19.722 C 4.11 19.581 4.301 19.502 4.5 19.502 L 12 19.502 C 12.199 19.502 12.39 19.581 12.53 19.722 C 12.671 19.863 12.75 20.053 12.75 20.252 Z M 16.5 8.252 C 16.503 9.503 16.221 10.737 15.674 11.862 C 15.128 12.986 14.332 13.971 13.346 14.741 C 13.162 14.882 13.013 15.063 12.909 15.271 C 12.806 15.479 12.752 15.708 12.75 15.94 L 12.75 16.502 C 12.75 16.9 12.592 17.282 12.311 17.563 C 12.029 17.844 11.648 18.002 11.25 18.002 L 5.25 18.002 C 4.852 18.002 4.471 17.844 4.189 17.563 C 3.908 17.282 3.75 16.9 3.75 16.502 L 3.75 15.94 C 3.75 15.711 3.697 15.484 3.596 15.279 C 3.495 15.073 3.348 14.893 3.166 14.753 C 2.183 13.988 1.388 13.009 0.839 11.891 C 0.291 10.772 0.004 9.544 0 8.298 C -0.024 3.83 3.587 0.109 8.051 0.002 C 9.151 -0.024 10.246 0.17 11.27 0.572 C 12.294 0.975 13.227 1.579 14.014 2.347 C 14.801 3.116 15.427 4.035 15.854 5.049 C 16.281 6.063 16.5 7.152 16.5 8.252 Z M 13.49 7.377 C 13.295 6.29 12.773 5.29 11.992 4.51 C 11.212 3.729 10.211 3.207 9.125 3.013 C 9.028 2.996 8.928 2.999 8.832 3.021 C 8.736 3.043 8.646 3.084 8.565 3.141 C 8.485 3.198 8.417 3.271 8.364 3.354 C 8.312 3.438 8.277 3.531 8.26 3.628 C 8.244 3.725 8.247 3.824 8.269 3.92 C 8.291 4.016 8.332 4.107 8.389 4.187 C 8.446 4.268 8.518 4.336 8.602 4.388 C 8.685 4.44 8.778 4.476 8.875 4.492 C 10.429 4.754 11.747 6.072 12.01 7.628 C 12.04 7.803 12.131 7.961 12.266 8.076 C 12.401 8.19 12.573 8.252 12.75 8.252 C 12.793 8.252 12.835 8.249 12.877 8.242 C 13.073 8.209 13.247 8.099 13.362 7.936 C 13.477 7.774 13.523 7.573 13.49 7.377 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.750 1.498)\"/>"
    },
    "LightbulbWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 18 27.503 C 18 27.901 17.842 28.283 17.561 28.564 C 17.28 28.845 16.898 29.003 16.5 29.003 L 6.5 29.003 C 6.102 29.003 5.721 28.845 5.44 28.564 C 5.158 28.283 5 27.901 5 27.503 C 5 27.105 5.158 26.724 5.44 26.443 C 5.721 26.161 6.102 26.003 6.5 26.003 L 16.5 26.003 C 16.898 26.003 17.28 26.161 17.561 26.443 C 17.842 26.724 18 27.105 18 27.503 Z M 23 11.503 C 23.005 13.246 22.611 14.967 21.849 16.534 C 21.087 18.102 19.977 19.474 18.604 20.547 C 18.418 20.689 18.267 20.871 18.162 21.08 C 18.058 21.289 18.002 21.52 18 21.753 L 18 22.003 C 18 22.666 17.737 23.302 17.268 23.771 C 16.799 24.24 16.163 24.503 15.5 24.503 L 7.5 24.503 C 6.837 24.503 6.201 24.24 5.732 23.771 C 5.264 23.302 5 22.666 5 22.003 L 5 21.753 C 5 21.523 4.947 21.297 4.845 21.09 C 4.743 20.884 4.595 20.704 4.413 20.565 C 3.043 19.498 1.934 18.134 1.17 16.575 C 0.405 15.016 0.005 13.304 0 11.568 C -0.034 5.34 5 0.153 11.224 0.003 C 12.757 -0.034 14.282 0.237 15.71 0.798 C 17.137 1.36 18.438 2.201 19.535 3.272 C 20.632 4.344 21.504 5.624 22.099 7.038 C 22.694 8.451 23.001 9.97 23 11.503 Z M 20 11.503 C 20.001 10.37 19.774 9.247 19.334 8.202 C 18.894 7.157 18.249 6.211 17.438 5.419 C 16.627 4.627 15.665 4.005 14.61 3.59 C 13.555 3.175 12.427 2.976 11.294 3.003 C 6.695 3.113 2.975 6.947 3 11.551 C 3.004 12.834 3.3 14.099 3.866 15.251 C 4.431 16.403 5.25 17.411 6.263 18.2 C 6.773 18.593 7.192 19.092 7.492 19.662 C 7.791 20.232 7.965 20.86 8 21.503 L 15.013 21.503 C 15.049 20.859 15.222 20.23 15.522 19.658 C 15.822 19.086 16.241 18.586 16.75 18.19 C 17.765 17.396 18.586 16.381 19.149 15.223 C 19.712 14.064 20.003 12.792 20 11.503 Z M 17.491 10.838 C 17.359 9.716 16.915 8.653 16.21 7.769 C 15.505 6.886 14.568 6.217 13.503 5.838 C 13.13 5.717 12.725 5.745 12.374 5.918 C 12.023 6.091 11.753 6.395 11.623 6.764 C 11.492 7.133 11.511 7.539 11.675 7.894 C 11.84 8.249 12.137 8.526 12.503 8.666 C 13.038 8.853 13.51 9.187 13.865 9.629 C 14.221 10.071 14.445 10.603 14.514 11.166 C 14.558 11.561 14.757 11.923 15.067 12.172 C 15.221 12.295 15.398 12.387 15.587 12.442 C 15.776 12.497 15.974 12.514 16.17 12.492 C 16.366 12.47 16.556 12.41 16.728 12.315 C 16.901 12.22 17.053 12.092 17.176 11.939 C 17.299 11.785 17.391 11.608 17.446 11.419 C 17.501 11.23 17.518 11.032 17.496 10.836 L 17.491 10.838 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 1.497)\"/>"
    },
    "LightbulbWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 20 10.003 C 20.001 11.518 19.658 13.014 18.995 14.376 C 18.333 15.739 17.369 16.933 16.176 17.868 C 15.812 18.15 15.517 18.512 15.313 18.925 C 15.109 19.338 15.002 19.792 15 20.253 L 15 21.003 C 15 21.268 14.895 21.522 14.707 21.71 C 14.52 21.898 14.265 22.003 14 22.003 L 6 22.003 C 5.735 22.003 5.481 21.898 5.293 21.71 C 5.106 21.522 5 21.268 5 21.003 L 5 20.253 C 5 19.795 4.895 19.343 4.693 18.931 C 4.492 18.52 4.199 18.159 3.838 17.878 C 2.649 16.949 1.686 15.763 1.021 14.409 C 0.357 13.055 0.008 11.568 0 10.059 C -0.03 4.639 4.34 0.128 9.759 0.003 C 11.092 -0.029 12.419 0.206 13.66 0.694 C 14.901 1.182 16.032 1.913 16.986 2.845 C 17.941 3.777 18.699 4.89 19.217 6.12 C 19.734 7.349 20.001 8.669 20 10.003 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.000 2.997)\"/><path d=\"M 17 27.003 C 17 27.268 16.895 27.523 16.707 27.71 C 16.52 27.898 16.265 28.003 16 28.003 L 6 28.003 C 5.735 28.003 5.481 27.898 5.293 27.71 C 5.106 27.523 5 27.268 5 27.003 C 5 26.738 5.106 26.484 5.293 26.296 C 5.481 26.109 5.735 26.003 6 26.003 L 16 26.003 C 16.265 26.003 16.52 26.109 16.707 26.296 C 16.895 26.484 17 26.738 17 27.003 Z M 22 11.003 C 22.004 12.67 21.628 14.316 20.899 15.816 C 20.17 17.315 19.109 18.628 17.795 19.654 C 17.55 19.843 17.35 20.085 17.212 20.362 C 17.075 20.639 17.002 20.944 17 21.253 L 17 22.003 C 17 22.534 16.789 23.042 16.414 23.417 C 16.039 23.792 15.531 24.003 15 24.003 L 7 24.003 C 6.47 24.003 5.961 23.792 5.586 23.417 C 5.211 23.042 5 22.534 5 22.003 L 5 21.253 C 5 20.947 4.93 20.646 4.795 20.371 C 4.66 20.097 4.464 19.857 4.221 19.671 C 2.911 18.65 1.85 17.345 1.119 15.854 C 0.388 14.363 0.005 12.725 0 11.064 C -0.032 5.107 4.783 0.146 10.735 0.003 C 12.202 -0.032 13.661 0.226 15.026 0.763 C 16.391 1.3 17.636 2.105 18.685 3.13 C 19.735 4.155 20.569 5.379 21.138 6.732 C 21.708 8.084 22.001 9.536 22 11.003 Z M 20 11.003 C 20.001 9.803 19.761 8.614 19.295 7.508 C 18.829 6.402 18.147 5.4 17.288 4.561 C 16.429 3.722 15.411 3.064 14.294 2.625 C 13.176 2.186 11.983 1.974 10.783 2.003 C 5.908 2.118 1.974 6.177 2 11.052 C 2.005 12.41 2.318 13.75 2.917 14.969 C 3.515 16.188 4.383 17.255 5.455 18.089 C 5.937 18.464 6.327 18.944 6.594 19.492 C 6.862 20.041 7.001 20.643 7 21.253 L 7 22.003 L 15 22.003 L 15 21.253 C 15.002 20.641 15.143 20.038 15.413 19.488 C 15.683 18.939 16.075 18.459 16.559 18.084 C 17.634 17.244 18.503 16.169 19.099 14.942 C 19.696 13.715 20.004 12.368 20 11.003 Z M 17.986 9.836 C 17.727 8.387 17.03 7.053 15.99 6.013 C 14.949 4.972 13.615 4.276 12.166 4.017 C 12.037 3.995 11.904 3.999 11.776 4.028 C 11.648 4.058 11.527 4.112 11.42 4.188 C 11.313 4.264 11.222 4.361 11.153 4.472 C 11.083 4.583 11.036 4.707 11.014 4.837 C 10.992 4.966 10.996 5.099 11.025 5.227 C 11.055 5.355 11.109 5.476 11.185 5.583 C 11.261 5.69 11.358 5.781 11.469 5.851 C 11.58 5.92 11.704 5.968 11.834 5.989 C 13.905 6.338 15.663 8.096 16.014 10.171 C 16.053 10.404 16.174 10.615 16.355 10.767 C 16.535 10.92 16.764 11.003 17 11.003 C 17.057 11.003 17.113 10.998 17.169 10.989 C 17.43 10.945 17.663 10.798 17.817 10.582 C 17.97 10.365 18.031 10.097 17.986 9.836 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.000 1.997)\"/>"
    },
    "LightbulbWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 17 27.003 C 17 27.268 16.895 27.523 16.707 27.71 C 16.52 27.898 16.265 28.003 16 28.003 L 6 28.003 C 5.735 28.003 5.481 27.898 5.293 27.71 C 5.106 27.523 5 27.268 5 27.003 C 5 26.738 5.106 26.484 5.293 26.296 C 5.481 26.109 5.735 26.003 6 26.003 L 16 26.003 C 16.265 26.003 16.52 26.109 16.707 26.296 C 16.895 26.484 17 26.738 17 27.003 Z M 22 11.003 C 22.004 12.67 21.628 14.316 20.899 15.816 C 20.17 17.315 19.109 18.628 17.795 19.654 C 17.55 19.843 17.35 20.085 17.212 20.362 C 17.075 20.639 17.002 20.944 17 21.253 L 17 22.003 C 17 22.534 16.789 23.042 16.414 23.417 C 16.039 23.792 15.531 24.003 15 24.003 L 7 24.003 C 6.47 24.003 5.961 23.792 5.586 23.417 C 5.211 23.042 5 22.534 5 22.003 L 5 21.253 C 5 20.947 4.93 20.646 4.795 20.371 C 4.66 20.097 4.464 19.857 4.221 19.671 C 2.911 18.65 1.85 17.345 1.119 15.854 C 0.388 14.363 0.005 12.725 0 11.064 C -0.032 5.107 4.783 0.146 10.735 0.003 C 12.202 -0.032 13.661 0.226 15.026 0.763 C 16.391 1.3 17.636 2.105 18.685 3.13 C 19.735 4.155 20.569 5.379 21.138 6.732 C 21.708 8.084 22.001 9.536 22 11.003 Z M 17.986 9.836 C 17.727 8.387 17.03 7.053 15.99 6.013 C 14.949 4.972 13.615 4.276 12.166 4.017 C 12.037 3.995 11.904 3.999 11.776 4.028 C 11.648 4.058 11.527 4.112 11.42 4.188 C 11.313 4.264 11.222 4.361 11.153 4.472 C 11.083 4.583 11.036 4.707 11.014 4.837 C 10.992 4.966 10.996 5.099 11.025 5.227 C 11.055 5.355 11.109 5.476 11.185 5.583 C 11.261 5.69 11.358 5.781 11.469 5.851 C 11.58 5.92 11.704 5.968 11.834 5.989 C 13.905 6.338 15.663 8.096 16.014 10.171 C 16.053 10.404 16.174 10.615 16.355 10.767 C 16.535 10.92 16.764 11.003 17 11.003 C 17.057 11.003 17.113 10.998 17.169 10.989 C 17.43 10.945 17.663 10.798 17.817 10.582 C 17.97 10.365 18.031 10.097 17.986 9.836 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.000 1.997)\"/>"
    },
    "LightbulbWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 16.5 26.753 C 16.5 26.952 16.421 27.143 16.28 27.283 C 16.14 27.424 15.949 27.503 15.75 27.503 L 5.75 27.503 C 5.551 27.503 5.36 27.424 5.22 27.283 C 5.079 27.143 5 26.952 5 26.753 C 5 26.554 5.079 26.363 5.22 26.223 C 5.36 26.082 5.551 26.003 5.75 26.003 L 15.75 26.003 C 15.949 26.003 16.14 26.082 16.28 26.223 C 16.421 26.363 16.5 26.554 16.5 26.753 Z M 21.5 10.753 C 21.504 12.382 21.136 13.991 20.424 15.456 C 19.712 16.922 18.674 18.205 17.39 19.208 C 17.115 19.42 16.892 19.691 16.737 20.003 C 16.583 20.314 16.502 20.656 16.5 21.003 L 16.5 21.753 C 16.5 22.217 16.316 22.662 15.988 22.991 C 15.659 23.319 15.214 23.503 14.75 23.503 L 6.75 23.503 C 6.286 23.503 5.841 23.319 5.513 22.991 C 5.185 22.662 5 22.217 5 21.753 L 5 21.003 C 5 20.659 4.921 20.321 4.769 20.012 C 4.617 19.704 4.397 19.434 4.125 19.224 C 2.845 18.228 1.809 16.953 1.094 15.497 C 0.38 14.041 0.006 12.441 0 10.819 C -0.032 4.992 4.674 0.143 10.491 0.003 C 11.925 -0.031 13.351 0.221 14.685 0.746 C 16.019 1.271 17.235 2.057 18.261 3.059 C 19.286 4.06 20.101 5.257 20.658 6.579 C 21.214 7.9 21.501 9.319 21.5 10.753 Z M 20 10.753 C 20.001 9.519 19.754 8.298 19.275 7.161 C 18.796 6.024 18.095 4.994 17.212 4.132 C 16.33 3.27 15.283 2.593 14.135 2.142 C 12.987 1.69 11.76 1.473 10.526 1.503 C 5.521 1.628 1.473 5.796 1.5 10.806 C 1.505 12.202 1.827 13.578 2.442 14.831 C 3.057 16.085 3.949 17.182 5.05 18.039 C 5.502 18.39 5.868 18.839 6.12 19.353 C 6.371 19.867 6.501 20.431 6.5 21.003 L 6.5 21.753 C 6.5 21.819 6.527 21.883 6.573 21.93 C 6.62 21.977 6.684 22.003 6.75 22.003 L 14.75 22.003 C 14.816 22.003 14.88 21.977 14.927 21.93 C 14.974 21.883 15 21.819 15 21.753 L 15 21.003 C 15.002 20.429 15.134 19.863 15.388 19.348 C 15.641 18.833 16.009 18.382 16.463 18.031 C 17.568 17.167 18.461 16.063 19.075 14.802 C 19.688 13.54 20.004 12.156 20 10.753 Z M 17.49 9.628 C 17.24 8.231 16.568 6.943 15.564 5.939 C 14.56 4.935 13.273 4.263 11.875 4.013 C 11.778 3.997 11.679 4 11.582 4.022 C 11.486 4.044 11.396 4.084 11.315 4.141 C 11.153 4.257 11.043 4.432 11.01 4.628 C 10.977 4.824 11.023 5.026 11.139 5.188 C 11.254 5.35 11.429 5.46 11.625 5.493 C 13.798 5.858 15.641 7.703 16.01 9.878 C 16.04 10.053 16.13 10.211 16.265 10.326 C 16.4 10.44 16.572 10.503 16.749 10.503 C 16.791 10.503 16.833 10.499 16.874 10.493 C 16.971 10.477 17.064 10.442 17.148 10.389 C 17.232 10.337 17.304 10.269 17.362 10.188 C 17.419 10.108 17.46 10.017 17.482 9.921 C 17.504 9.825 17.507 9.725 17.49 9.628 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.250 2.247)\"/>"
    },
    "LightbulbWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 17 27.003 C 17 27.268 16.895 27.523 16.707 27.71 C 16.52 27.898 16.265 28.003 16 28.003 L 6 28.003 C 5.735 28.003 5.481 27.898 5.293 27.71 C 5.106 27.523 5 27.268 5 27.003 C 5 26.738 5.106 26.484 5.293 26.296 C 5.481 26.109 5.735 26.003 6 26.003 L 16 26.003 C 16.265 26.003 16.52 26.109 16.707 26.296 C 16.895 26.484 17 26.738 17 27.003 Z M 22 11.003 C 22.004 12.67 21.628 14.316 20.899 15.816 C 20.17 17.315 19.109 18.628 17.795 19.654 C 17.55 19.843 17.35 20.085 17.212 20.362 C 17.075 20.639 17.002 20.944 17 21.253 L 17 22.003 C 17 22.534 16.789 23.042 16.414 23.417 C 16.039 23.792 15.531 24.003 15 24.003 L 7 24.003 C 6.47 24.003 5.961 23.792 5.586 23.417 C 5.211 23.042 5 22.534 5 22.003 L 5 21.253 C 5 20.947 4.93 20.646 4.795 20.371 C 4.66 20.097 4.464 19.857 4.221 19.671 C 2.911 18.65 1.85 17.345 1.119 15.854 C 0.388 14.363 0.005 12.725 0 11.064 C -0.032 5.107 4.783 0.146 10.735 0.003 C 12.202 -0.032 13.661 0.226 15.026 0.763 C 16.391 1.3 17.636 2.105 18.685 3.13 C 19.735 4.155 20.569 5.379 21.138 6.732 C 21.708 8.084 22.001 9.536 22 11.003 Z M 20 11.003 C 20.001 9.803 19.761 8.614 19.295 7.508 C 18.829 6.402 18.147 5.4 17.288 4.561 C 16.429 3.722 15.411 3.064 14.294 2.625 C 13.176 2.186 11.983 1.974 10.783 2.003 C 5.908 2.118 1.974 6.177 2 11.052 C 2.005 12.41 2.318 13.75 2.917 14.969 C 3.515 16.188 4.383 17.255 5.455 18.089 C 5.937 18.464 6.327 18.944 6.594 19.492 C 6.862 20.041 7.001 20.643 7 21.253 L 7 22.003 L 15 22.003 L 15 21.253 C 15.002 20.641 15.143 20.038 15.413 19.488 C 15.683 18.939 16.075 18.459 16.559 18.084 C 17.634 17.244 18.503 16.169 19.099 14.942 C 19.696 13.715 20.004 12.368 20 11.003 Z M 17.986 9.836 C 17.727 8.387 17.03 7.053 15.99 6.013 C 14.949 4.972 13.615 4.276 12.166 4.017 C 12.037 3.995 11.904 3.999 11.776 4.028 C 11.648 4.058 11.527 4.112 11.42 4.188 C 11.313 4.264 11.222 4.361 11.153 4.472 C 11.083 4.583 11.036 4.707 11.014 4.837 C 10.992 4.966 10.996 5.099 11.025 5.227 C 11.055 5.355 11.109 5.476 11.185 5.583 C 11.261 5.69 11.358 5.781 11.469 5.851 C 11.58 5.92 11.704 5.968 11.834 5.989 C 13.905 6.338 15.663 8.096 16.014 10.171 C 16.053 10.404 16.174 10.615 16.355 10.767 C 16.535 10.92 16.764 11.003 17 11.003 C 17.057 11.003 17.113 10.998 17.169 10.989 C 17.43 10.945 17.663 10.798 17.817 10.582 C 17.97 10.365 18.031 10.097 17.986 9.836 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.000 1.997)\"/>"
    },
    "LightbulbWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 16 26.503 C 16 26.636 15.947 26.763 15.854 26.857 C 15.76 26.95 15.633 27.003 15.5 27.003 L 5.5 27.003 C 5.368 27.003 5.24 26.95 5.147 26.857 C 5.053 26.763 5 26.636 5 26.503 C 5 26.37 5.053 26.243 5.147 26.149 C 5.24 26.056 5.368 26.003 5.5 26.003 L 15.5 26.003 C 15.633 26.003 15.76 26.056 15.854 26.149 C 15.947 26.243 16 26.37 16 26.503 Z M 21 10.503 C 21.004 12.094 20.644 13.665 19.949 15.096 C 19.253 16.527 18.24 17.781 16.986 18.76 C 16.681 18.995 16.433 19.297 16.262 19.642 C 16.091 19.988 16.002 20.368 16 20.753 L 16 21.503 C 16 21.901 15.842 22.282 15.561 22.564 C 15.28 22.845 14.898 23.003 14.5 23.003 L 6.5 23.003 C 6.102 23.003 5.721 22.845 5.439 22.564 C 5.158 22.282 5 21.901 5 21.503 L 5 20.753 C 5 20.371 4.913 19.995 4.744 19.652 C 4.576 19.31 4.332 19.01 4.03 18.777 C 2.779 17.803 1.766 16.557 1.068 15.134 C 0.37 13.711 0.005 12.147 0 10.562 C -0.031 4.878 4.565 0.139 10.25 0.003 C 11.65 -0.03 13.042 0.217 14.345 0.729 C 15.648 1.242 16.835 2.01 17.837 2.989 C 18.839 3.967 19.634 5.136 20.178 6.426 C 20.721 7.717 21.001 9.103 21 10.503 Z M 20 10.503 C 20.001 9.236 19.747 7.982 19.256 6.814 C 18.764 5.646 18.044 4.588 17.137 3.703 C 16.231 2.818 15.156 2.123 13.977 1.659 C 12.798 1.196 11.538 0.972 10.271 1.003 C 5.125 1.128 0.971 5.412 1 10.557 C 1.005 11.99 1.335 13.404 1.967 14.691 C 2.599 15.978 3.515 17.105 4.646 17.985 C 5.068 18.313 5.41 18.733 5.644 19.212 C 5.879 19.692 6.001 20.219 6 20.753 L 6 21.503 C 6 21.636 6.053 21.763 6.147 21.857 C 6.24 21.95 6.368 22.003 6.5 22.003 L 14.5 22.003 C 14.633 22.003 14.76 21.95 14.854 21.857 C 14.947 21.763 15 21.636 15 21.503 L 15 20.753 C 15.002 20.217 15.125 19.688 15.362 19.207 C 15.599 18.726 15.943 18.306 16.368 17.978 C 17.503 17.091 18.42 15.957 19.049 14.661 C 19.679 13.366 20.004 11.943 20 10.503 Z M 11.583 4.01 C 11.455 3.996 11.327 4.03 11.225 4.108 C 11.122 4.185 11.053 4.298 11.032 4.425 C 11.011 4.551 11.039 4.681 11.111 4.787 C 11.183 4.893 11.292 4.968 11.418 4.995 C 13.691 5.378 15.625 7.309 16.008 9.587 C 16.027 9.703 16.088 9.809 16.178 9.885 C 16.268 9.961 16.382 10.003 16.5 10.003 C 16.528 10.003 16.556 10 16.584 9.995 C 16.714 9.973 16.831 9.9 16.907 9.792 C 16.984 9.684 17.015 9.55 16.993 9.419 C 16.752 8.073 16.105 6.832 15.137 5.865 C 14.17 4.898 12.929 4.251 11.583 4.01 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.500 2.497)\"/>"
    },
    "ListWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25 9.5 C 25 9.898 24.842 10.279 24.561 10.561 C 24.279 10.842 23.898 11 23.5 11 L 1.5 11 C 1.102 11 0.721 10.842 0.439 10.561 C 0.158 10.279 0 9.898 0 9.5 C 0 9.102 0.158 8.721 0.439 8.439 C 0.721 8.158 1.102 8 1.5 8 L 23.5 8 C 23.898 8 24.279 8.158 24.561 8.439 C 24.842 8.721 25 9.102 25 9.5 Z M 1.5 3 L 23.5 3 C 23.898 3 24.279 2.842 24.561 2.561 C 24.842 2.279 25 1.898 25 1.5 C 25 1.102 24.842 0.721 24.561 0.439 C 24.279 0.158 23.898 0 23.5 0 L 1.5 0 C 1.102 0 0.721 0.158 0.439 0.439 C 0.158 0.721 0 1.102 0 1.5 C 0 1.898 0.158 2.279 0.439 2.561 C 0.721 2.842 1.102 3 1.5 3 Z M 23.5 16 L 1.5 16 C 1.102 16 0.721 16.158 0.439 16.439 C 0.158 16.721 0 17.102 0 17.5 C 0 17.898 0.158 18.279 0.439 18.561 C 0.721 18.842 1.102 19 1.5 19 L 23.5 19 C 23.898 19 24.279 18.842 24.561 18.561 C 24.842 18.279 25 17.898 25 17.5 C 25 17.102 24.842 16.721 24.561 16.439 C 24.279 16.158 23.898 16 23.5 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 6.500)\"/>"
    },
    "ListWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 0 L 22 16 L 0 16 L 0 0 L 22 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 8)\"/><path d=\"M 24 9 C 24 9.265 23.895 9.52 23.707 9.707 C 23.52 9.895 23.265 10 23 10 L 1 10 C 0.735 10 0.48 9.895 0.293 9.707 C 0.105 9.52 0 9.265 0 9 C 0 8.735 0.105 8.48 0.293 8.293 C 0.48 8.105 0.735 8 1 8 L 23 8 C 23.265 8 23.52 8.105 23.707 8.293 C 23.895 8.48 24 8.735 24 9 Z M 1 2 L 23 2 C 23.265 2 23.52 1.895 23.707 1.707 C 23.895 1.52 24 1.265 24 1 C 24 0.735 23.895 0.48 23.707 0.293 C 23.52 0.105 23.265 0 23 0 L 1 0 C 0.735 0 0.48 0.105 0.293 0.293 C 0.105 0.48 0 0.735 0 1 C 0 1.265 0.105 1.52 0.293 1.707 C 0.48 1.895 0.735 2 1 2 Z M 23 16 L 1 16 C 0.735 16 0.48 16.105 0.293 16.293 C 0.105 16.48 0 16.735 0 17 C 0 17.265 0.105 17.52 0.293 17.707 C 0.48 17.895 0.735 18 1 18 L 23 18 C 23.265 18 23.52 17.895 23.707 17.707 C 23.895 17.52 24 17.265 24 17 C 24 16.735 23.895 16.48 23.707 16.293 C 23.52 16.105 23.265 16 23 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 7)\"/>"
    },
    "ListWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 9 L 24 11 C 24 11.265 23.895 11.52 23.707 11.707 C 23.52 11.895 23.265 12 23 12 L 1 12 C 0.735 12 0.48 11.895 0.293 11.707 C 0.105 11.52 0 11.265 0 11 L 0 9 C 0 8.735 0.105 8.48 0.293 8.293 C 0.48 8.105 0.735 8 1 8 L 23 8 C 23.265 8 23.52 8.105 23.707 8.293 C 23.895 8.48 24 8.735 24 9 Z M 23 16 L 1 16 C 0.735 16 0.48 16.105 0.293 16.293 C 0.105 16.48 0 16.735 0 17 L 0 19 C 0 19.265 0.105 19.52 0.293 19.707 C 0.48 19.895 0.735 20 1 20 L 23 20 C 23.265 20 23.52 19.895 23.707 19.707 C 23.895 19.52 24 19.265 24 19 L 24 17 C 24 16.735 23.895 16.48 23.707 16.293 C 23.52 16.105 23.265 16 23 16 Z M 23 0 L 1 0 C 0.735 0 0.48 0.105 0.293 0.293 C 0.105 0.48 0 0.735 0 1 L 0 3 C 0 3.265 0.105 3.52 0.293 3.707 C 0.48 3.895 0.735 4 1 4 L 23 4 C 23.265 4 23.52 3.895 23.707 3.707 C 23.895 3.52 24 3.265 24 3 L 24 1 C 24 0.735 23.895 0.48 23.707 0.293 C 23.52 0.105 23.265 0 23 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 6)\"/>"
    },
    "ListWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.5 8.75 C 23.5 8.949 23.421 9.14 23.28 9.28 C 23.14 9.421 22.949 9.5 22.75 9.5 L 0.75 9.5 C 0.551 9.5 0.36 9.421 0.22 9.28 C 0.079 9.14 0 8.949 0 8.75 C 0 8.551 0.079 8.36 0.22 8.22 C 0.36 8.079 0.551 8 0.75 8 L 22.75 8 C 22.949 8 23.14 8.079 23.28 8.22 C 23.421 8.36 23.5 8.551 23.5 8.75 Z M 0.75 1.5 L 22.75 1.5 C 22.949 1.5 23.14 1.421 23.28 1.28 C 23.421 1.14 23.5 0.949 23.5 0.75 C 23.5 0.551 23.421 0.36 23.28 0.22 C 23.14 0.079 22.949 0 22.75 0 L 0.75 0 C 0.551 0 0.36 0.079 0.22 0.22 C 0.079 0.36 0 0.551 0 0.75 C 0 0.949 0.079 1.14 0.22 1.28 C 0.36 1.421 0.551 1.5 0.75 1.5 Z M 22.75 16 L 0.75 16 C 0.551 16 0.36 16.079 0.22 16.22 C 0.079 16.36 0 16.551 0 16.75 C 0 16.949 0.079 17.14 0.22 17.28 C 0.36 17.421 0.551 17.5 0.75 17.5 L 22.75 17.5 C 22.949 17.5 23.14 17.421 23.28 17.28 C 23.421 17.14 23.5 16.949 23.5 16.75 C 23.5 16.551 23.421 16.36 23.28 16.22 C 23.14 16.079 22.949 16 22.75 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.250 7.250)\"/>"
    },
    "ListWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 9 C 24 9.265 23.895 9.52 23.707 9.707 C 23.52 9.895 23.265 10 23 10 L 1 10 C 0.735 10 0.48 9.895 0.293 9.707 C 0.105 9.52 0 9.265 0 9 C 0 8.735 0.105 8.48 0.293 8.293 C 0.48 8.105 0.735 8 1 8 L 23 8 C 23.265 8 23.52 8.105 23.707 8.293 C 23.895 8.48 24 8.735 24 9 Z M 1 2 L 23 2 C 23.265 2 23.52 1.895 23.707 1.707 C 23.895 1.52 24 1.265 24 1 C 24 0.735 23.895 0.48 23.707 0.293 C 23.52 0.105 23.265 0 23 0 L 1 0 C 0.735 0 0.48 0.105 0.293 0.293 C 0.105 0.48 0 0.735 0 1 C 0 1.265 0.105 1.52 0.293 1.707 C 0.48 1.895 0.735 2 1 2 Z M 23 16 L 1 16 C 0.735 16 0.48 16.105 0.293 16.293 C 0.105 16.48 0 16.735 0 17 C 0 17.265 0.105 17.52 0.293 17.707 C 0.48 17.895 0.735 18 1 18 L 23 18 C 23.265 18 23.52 17.895 23.707 17.707 C 23.895 17.52 24 17.265 24 17 C 24 16.735 23.895 16.48 23.707 16.293 C 23.52 16.105 23.265 16 23 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 7)\"/>"
    },
    "ListWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23 8.5 C 23 8.633 22.947 8.76 22.854 8.854 C 22.76 8.947 22.633 9 22.5 9 L 0.5 9 C 0.367 9 0.24 8.947 0.146 8.854 C 0.053 8.76 0 8.633 0 8.5 C 0 8.367 0.053 8.24 0.146 8.146 C 0.24 8.053 0.367 8 0.5 8 L 22.5 8 C 22.633 8 22.76 8.053 22.854 8.146 C 22.947 8.24 23 8.367 23 8.5 Z M 0.5 1 L 22.5 1 C 22.633 1 22.76 0.947 22.854 0.854 C 22.947 0.76 23 0.633 23 0.5 C 23 0.367 22.947 0.24 22.854 0.146 C 22.76 0.053 22.633 0 22.5 0 L 0.5 0 C 0.367 0 0.24 0.053 0.146 0.146 C 0.053 0.24 0 0.367 0 0.5 C 0 0.633 0.053 0.76 0.146 0.854 C 0.24 0.947 0.367 1 0.5 1 Z M 22.5 16 L 0.5 16 C 0.367 16 0.24 16.053 0.146 16.146 C 0.053 16.24 0 16.367 0 16.5 C 0 16.633 0.053 16.76 0.146 16.854 C 0.24 16.947 0.367 17 0.5 17 L 22.5 17 C 22.633 17 22.76 16.947 22.854 16.854 C 22.947 16.76 23 16.633 23 16.5 C 23 16.367 22.947 16.24 22.854 16.146 C 22.76 16.053 22.633 16 22.5 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 7.500)\"/>"
    },
    "Logout": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 7.499 17.25 C 7.499 17.449 7.42 17.64 7.279 17.78 C 7.139 17.921 6.948 18 6.749 18 L 1.5 18 C 1.102 18 0.721 17.842 0.439 17.561 C 0.158 17.279 0 16.898 0 16.5 L 0 1.5 C 0 1.102 0.158 0.721 0.439 0.439 C 0.721 0.158 1.102 0 1.5 0 L 6.749 0 C 6.948 0 7.139 0.079 7.279 0.22 C 7.42 0.36 7.499 0.551 7.499 0.75 C 7.499 0.949 7.42 1.14 7.279 1.28 C 7.139 1.421 6.948 1.5 6.749 1.5 L 1.5 1.5 L 1.5 16.5 L 6.749 16.5 C 6.948 16.5 7.139 16.579 7.279 16.72 C 7.42 16.86 7.499 17.051 7.499 17.25 Z M 17.778 8.469 L 14.029 4.719 C 13.888 4.579 13.697 4.5 13.498 4.5 C 13.299 4.5 13.108 4.579 12.967 4.719 C 12.827 4.86 12.748 5.051 12.748 5.25 C 12.748 5.449 12.827 5.64 12.967 5.781 L 15.437 8.25 L 6.749 8.25 C 6.55 8.25 6.359 8.329 6.219 8.47 C 6.078 8.61 5.999 8.801 5.999 9 C 5.999 9.199 6.078 9.39 6.219 9.53 C 6.359 9.671 6.55 9.75 6.749 9.75 L 15.437 9.75 L 12.967 12.219 C 12.827 12.36 12.748 12.551 12.748 12.75 C 12.748 12.949 12.827 13.14 12.967 13.281 C 13.108 13.421 13.299 13.5 13.498 13.5 C 13.697 13.5 13.888 13.421 14.029 13.281 L 17.778 9.531 C 17.848 9.461 17.903 9.378 17.941 9.287 C 17.979 9.196 17.998 9.099 17.998 9 C 17.998 8.901 17.979 8.804 17.941 8.713 C 17.903 8.622 17.848 8.539 17.778 8.469 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.000 3)\"/>"
    },
    "MinusWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25 1.5 C 25 1.898 24.842 2.279 24.561 2.561 C 24.279 2.842 23.898 3 23.5 3 L 1.5 3 C 1.102 3 0.721 2.842 0.439 2.561 C 0.158 2.279 0 1.898 0 1.5 C 0 1.102 0.158 0.721 0.439 0.439 C 0.721 0.158 1.102 0 1.5 0 L 23.5 0 C 23.898 0 24.279 0.158 24.561 0.439 C 24.842 0.721 25 1.102 25 1.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 14.500)\"/>"
    },
    "MinusWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 1 L 22 21 C 22 21.265 21.895 21.52 21.707 21.707 C 21.52 21.895 21.265 22 21 22 L 1 22 C 0.735 22 0.48 21.895 0.293 21.707 C 0.105 21.52 0 21.265 0 21 L 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 21 0 C 21.265 0 21.52 0.105 21.707 0.293 C 21.895 0.48 22 0.735 22 1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 5)\"/><path d=\"M 24 1 C 24 1.265 23.895 1.52 23.707 1.707 C 23.52 1.895 23.265 2 23 2 L 1 2 C 0.735 2 0.48 1.895 0.293 1.707 C 0.105 1.52 0 1.265 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 23 0 C 23.265 0 23.52 0.105 23.707 0.293 C 23.895 0.48 24 0.735 24 1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 15)\"/>"
    },
    "MinusWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 0 L 2 0 C 1.47 0 0.961 0.211 0.586 0.586 C 0.211 0.961 0 1.47 0 2 L 0 22 C 0 22.53 0.211 23.039 0.586 23.414 C 0.961 23.789 1.47 24 2 24 L 22 24 C 22.53 24 23.039 23.789 23.414 23.414 C 23.789 23.039 24 22.53 24 22 L 24 2 C 24 1.47 23.789 0.961 23.414 0.586 C 23.039 0.211 22.53 0 22 0 Z M 19 13 L 5 13 C 4.735 13 4.48 12.895 4.293 12.707 C 4.105 12.52 4 12.265 4 12 C 4 11.735 4.105 11.48 4.293 11.293 C 4.48 11.105 4.735 11 5 11 L 19 11 C 19.265 11 19.52 11.105 19.707 11.293 C 19.895 11.48 20 11.735 20 12 C 20 12.265 19.895 12.52 19.707 12.707 C 19.52 12.895 19.265 13 19 13 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
    },
    "MinusWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.5 0.75 C 23.5 0.949 23.421 1.14 23.28 1.28 C 23.14 1.421 22.949 1.5 22.75 1.5 L 0.75 1.5 C 0.551 1.5 0.36 1.421 0.22 1.28 C 0.079 1.14 0 0.949 0 0.75 C 0 0.551 0.079 0.36 0.22 0.22 C 0.36 0.079 0.551 0 0.75 0 L 22.75 0 C 22.949 0 23.14 0.079 23.28 0.22 C 23.421 0.36 23.5 0.551 23.5 0.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.250 15.250)\"/>"
    },
    "MinusWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 1 C 24 1.265 23.895 1.52 23.707 1.707 C 23.52 1.895 23.265 2 23 2 L 1 2 C 0.735 2 0.48 1.895 0.293 1.707 C 0.105 1.52 0 1.265 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 23 0 C 23.265 0 23.52 0.105 23.707 0.293 C 23.895 0.48 24 0.735 24 1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 15)\"/>"
    },
    "MinusWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23 0.5 C 23 0.633 22.947 0.76 22.854 0.854 C 22.76 0.947 22.633 1 22.5 1 L 0.5 1 C 0.367 1 0.24 0.947 0.146 0.854 C 0.053 0.76 0 0.633 0 0.5 C 0 0.367 0.053 0.24 0.146 0.146 C 0.24 0.053 0.367 0 0.5 0 L 22.5 0 C 22.633 0 22.76 0.053 22.854 0.146 C 22.947 0.24 23 0.367 23 0.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 15.500)\"/>"
    },
    "Negative": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 20.701 15.383 L 12.503 1.146 C 12.298 0.797 12.005 0.508 11.654 0.307 C 11.303 0.106 10.906 0 10.501 0 C 10.096 0 9.699 0.106 9.348 0.307 C 8.997 0.508 8.704 0.797 8.499 1.146 L 0.301 15.383 C 0.104 15.721 0 16.105 0 16.495 C 0 16.886 0.104 17.27 0.301 17.607 C 0.503 17.958 0.795 18.249 1.147 18.45 C 1.499 18.651 1.898 18.754 2.303 18.75 L 18.699 18.75 C 19.104 18.754 19.503 18.65 19.854 18.449 C 20.205 18.249 20.497 17.958 20.699 17.607 C 20.897 17.27 21.001 16.886 21.001 16.496 C 21.001 16.105 20.898 15.721 20.701 15.383 Z M 19.401 16.856 C 19.329 16.978 19.227 17.079 19.103 17.148 C 18.98 17.217 18.841 17.253 18.699 17.25 L 2.303 17.25 C 2.161 17.253 2.022 17.217 1.899 17.148 C 1.775 17.079 1.673 16.978 1.601 16.856 C 1.537 16.747 1.502 16.622 1.502 16.494 C 1.502 16.367 1.537 16.242 1.601 16.133 L 9.8 1.895 C 9.873 1.773 9.976 1.673 10.099 1.603 C 10.222 1.534 10.361 1.497 10.503 1.497 C 10.644 1.497 10.784 1.534 10.907 1.603 C 11.03 1.673 11.133 1.773 11.206 1.895 L 19.404 16.133 C 19.469 16.243 19.502 16.368 19.501 16.495 C 19.501 16.622 19.466 16.747 19.401 16.856 Z M 9.751 11.25 L 9.751 7.5 C 9.751 7.301 9.83 7.11 9.971 6.97 C 10.111 6.829 10.302 6.75 10.501 6.75 C 10.7 6.75 10.891 6.829 11.031 6.97 C 11.172 7.11 11.251 7.301 11.251 7.5 L 11.251 11.25 C 11.251 11.449 11.172 11.64 11.031 11.78 C 10.891 11.921 10.7 12 10.501 12 C 10.302 12 10.111 11.921 9.971 11.78 C 9.83 11.64 9.751 11.449 9.751 11.25 Z M 11.626 14.625 C 11.626 14.848 11.56 15.065 11.436 15.25 C 11.313 15.435 11.137 15.579 10.932 15.664 C 10.726 15.75 10.5 15.772 10.282 15.728 C 10.063 15.685 9.863 15.578 9.706 15.421 C 9.548 15.263 9.441 15.063 9.398 14.845 C 9.354 14.626 9.376 14.4 9.462 14.195 C 9.547 13.989 9.691 13.813 9.876 13.69 C 10.061 13.566 10.279 13.5 10.501 13.5 C 10.799 13.5 11.086 13.619 11.297 13.83 C 11.507 14.041 11.626 14.327 11.626 14.625 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.499 2.250)\"/>"
    },
    "NegativeSolid": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 20.701 15.383 L 12.503 1.146 C 12.298 0.797 12.005 0.508 11.654 0.307 C 11.303 0.106 10.906 0 10.501 0 C 10.096 0 9.699 0.106 9.348 0.307 C 8.997 0.508 8.704 0.797 8.499 1.146 L 0.301 15.383 C 0.104 15.721 0 16.105 0 16.495 C 0 16.886 0.104 17.27 0.301 17.607 C 0.503 17.958 0.795 18.249 1.147 18.45 C 1.499 18.651 1.898 18.754 2.303 18.75 L 18.699 18.75 C 19.104 18.754 19.503 18.65 19.854 18.449 C 20.205 18.249 20.497 17.958 20.699 17.607 C 20.897 17.27 21.001 16.886 21.001 16.496 C 21.001 16.105 20.898 15.721 20.701 15.383 Z M 9.751 7.5 C 9.751 7.301 9.83 7.11 9.971 6.97 C 10.111 6.829 10.302 6.75 10.501 6.75 C 10.7 6.75 10.891 6.829 11.031 6.97 C 11.172 7.11 11.251 7.301 11.251 7.5 L 11.251 11.25 C 11.251 11.449 11.172 11.64 11.031 11.78 C 10.891 11.921 10.7 12 10.501 12 C 10.302 12 10.111 11.921 9.971 11.78 C 9.83 11.64 9.751 11.449 9.751 11.25 L 9.751 7.5 Z M 10.501 15.75 C 10.279 15.75 10.061 15.684 9.876 15.56 C 9.691 15.437 9.547 15.261 9.462 15.056 C 9.376 14.85 9.354 14.624 9.398 14.406 C 9.441 14.187 9.548 13.987 9.706 13.83 C 9.863 13.672 10.063 13.565 10.282 13.522 C 10.5 13.478 10.726 13.501 10.932 13.586 C 11.137 13.671 11.313 13.815 11.436 14 C 11.56 14.185 11.626 14.403 11.626 14.625 C 11.626 14.923 11.507 15.21 11.297 15.421 C 11.086 15.632 10.799 15.75 10.501 15.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.499 2.250)\"/>"
    },
    "PencilWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25.268 6.319 L 19.683 0.733 C 19.45 0.5 19.175 0.316 18.871 0.19 C 18.568 0.065 18.243 0 17.914 0 C 17.586 0 17.261 0.065 16.957 0.19 C 16.654 0.316 16.378 0.5 16.146 0.733 L 0.733 16.148 C 0.5 16.379 0.315 16.654 0.189 16.958 C 0.063 17.261 -0.001 17.587 0 17.915 L 0 23.501 C 0 24.164 0.263 24.8 0.732 25.269 C 1.201 25.738 1.837 26.001 2.5 26.001 L 8.086 26.001 C 8.415 26.002 8.74 25.938 9.043 25.812 C 9.347 25.686 9.622 25.502 9.854 25.269 L 25.268 9.854 C 25.736 9.385 25.999 8.749 25.999 8.086 C 25.999 7.423 25.736 6.788 25.268 6.319 Z M 8.125 20.001 L 17 11.126 L 18.375 12.501 L 9.5 21.376 L 8.125 20.001 Z M 6 17.876 L 4.625 16.501 L 13.5 7.626 L 14.875 9.001 L 6 17.876 Z M 3 19.126 L 4.939 21.065 L 6.875 23.001 L 3 23.001 L 3 19.126 Z M 20.5 10.376 L 15.625 5.501 L 17.918 3.209 L 22.793 8.084 L 20.5 10.376 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 2.499)\"/>"
    },
    "PencilWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 10.708 7.293 L 7 11 L 0 4 L 3.708 0.293 C 3.895 0.105 4.149 0 4.414 0 C 4.679 0 4.934 0.105 5.121 0.293 L 10.708 5.875 C 10.801 5.968 10.875 6.079 10.925 6.2 C 10.976 6.322 11.002 6.452 11.002 6.584 C 11.002 6.716 10.976 6.846 10.925 6.968 C 10.875 7.089 10.801 7.2 10.708 7.293 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 17 4.000)\"/><path d=\"M 24.414 6.172 L 18.829 0.586 C 18.643 0.4 18.423 0.253 18.18 0.152 C 17.937 0.052 17.677 0 17.414 0 C 17.152 0 16.892 0.052 16.649 0.152 C 16.406 0.253 16.186 0.4 16 0.586 L 0.586 16.001 C 0.4 16.186 0.252 16.406 0.151 16.649 C 0.051 16.892 -0.001 17.152 0 17.415 L 0 23.001 C 0 23.531 0.211 24.04 0.586 24.415 C 0.961 24.79 1.47 25.001 2 25.001 L 7.586 25.001 C 7.849 25.002 8.109 24.95 8.352 24.85 C 8.595 24.749 8.815 24.601 9 24.415 L 24.414 9.001 C 24.6 8.815 24.747 8.595 24.847 8.352 C 24.948 8.109 25 7.849 25 7.587 C 25 7.324 24.948 7.064 24.847 6.821 C 24.747 6.578 24.6 6.358 24.414 6.172 Z M 2.414 17.001 L 13 6.415 L 15.086 8.501 L 4.5 19.086 L 2.414 17.001 Z M 2 19.415 L 5.586 23.001 L 2 23.001 L 2 19.415 Z M 8 22.587 L 5.914 20.501 L 16.5 9.915 L 18.586 12.001 L 8 22.587 Z M 20 10.587 L 14.414 5.001 L 17.414 2.001 L 23 7.586 L 20 10.587 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 2.999)\"/>"
    },
    "PencilWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24.414 6.172 L 18.829 0.586 C 18.643 0.4 18.423 0.253 18.18 0.152 C 17.937 0.052 17.677 0 17.414 0 C 17.152 0 16.892 0.052 16.649 0.152 C 16.406 0.253 16.186 0.4 16 0.586 L 0.586 16.001 C 0.4 16.186 0.252 16.406 0.151 16.649 C 0.051 16.892 -0.001 17.152 0 17.415 L 0 23.001 C 0 23.531 0.211 24.04 0.586 24.415 C 0.961 24.79 1.47 25.001 2 25.001 L 7.586 25.001 C 7.849 25.002 8.109 24.95 8.352 24.85 C 8.595 24.749 8.815 24.601 9 24.415 L 24.414 9.001 C 24.6 8.815 24.747 8.595 24.847 8.352 C 24.948 8.109 25 7.849 25 7.587 C 25 7.324 24.948 7.064 24.847 6.821 C 24.747 6.578 24.6 6.358 24.414 6.172 Z M 2.414 17.001 L 13.708 5.707 L 15.793 7.793 L 4.5 19.086 L 2.414 17.001 Z M 2 19.415 L 5.586 23.001 L 2 23.001 L 2 19.415 Z M 8 22.587 L 5.914 20.501 L 17.208 9.207 L 19.293 11.293 L 8 22.587 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 2.999)\"/>"
    },
    "PencilWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.988 6.099 L 18.401 0.513 C 18.239 0.35 18.046 0.221 17.833 0.133 C 17.621 0.045 17.394 0 17.164 0 C 16.934 0 16.706 0.045 16.494 0.133 C 16.282 0.221 16.089 0.35 15.926 0.513 L 0.513 15.928 C 0.35 16.09 0.221 16.283 0.133 16.495 C 0.045 16.708 0 16.935 0 17.165 L 0 22.751 C 0 23.216 0.184 23.661 0.513 23.989 C 0.841 24.317 1.286 24.501 1.75 24.501 L 7.336 24.501 C 7.566 24.502 7.794 24.457 8.006 24.369 C 8.219 24.281 8.411 24.152 8.574 23.989 L 23.988 8.574 C 24.15 8.411 24.279 8.218 24.367 8.006 C 24.455 7.794 24.5 7.566 24.5 7.336 C 24.5 7.107 24.455 6.879 24.367 6.667 C 24.279 6.454 24.15 6.261 23.988 6.099 Z M 1.811 16.751 L 12.75 5.811 L 15.189 8.251 L 4.25 19.19 L 1.811 16.751 Z M 1.5 22.751 L 1.5 18.561 L 5.939 23.001 L 1.75 23.001 C 1.684 23.001 1.62 22.975 1.573 22.928 C 1.526 22.881 1.5 22.818 1.5 22.751 Z M 7.75 22.69 L 5.311 20.251 L 16.25 9.311 L 18.689 11.751 L 7.75 22.69 Z M 22.926 7.514 L 19.75 10.69 L 13.811 4.751 L 16.988 1.574 C 17.011 1.551 17.038 1.532 17.069 1.52 C 17.099 1.507 17.132 1.501 17.164 1.501 C 17.197 1.501 17.23 1.507 17.26 1.52 C 17.29 1.532 17.318 1.551 17.341 1.574 L 22.926 7.16 C 22.949 7.183 22.968 7.211 22.981 7.241 C 22.993 7.272 23 7.304 23 7.337 C 23 7.37 22.993 7.402 22.981 7.433 C 22.968 7.463 22.949 7.491 22.926 7.514 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.250 3.249)\"/>"
    },
    "PencilWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24.414 6.172 L 18.829 0.586 C 18.643 0.4 18.423 0.253 18.18 0.152 C 17.937 0.052 17.677 0 17.414 0 C 17.152 0 16.892 0.052 16.649 0.152 C 16.406 0.253 16.186 0.4 16 0.586 L 0.586 16.001 C 0.4 16.186 0.252 16.406 0.151 16.649 C 0.051 16.892 -0.001 17.152 0 17.415 L 0 23.001 C 0 23.531 0.211 24.04 0.586 24.415 C 0.961 24.79 1.47 25.001 2 25.001 L 7.586 25.001 C 7.849 25.002 8.109 24.95 8.352 24.85 C 8.595 24.749 8.815 24.601 9 24.415 L 24.414 9.001 C 24.6 8.815 24.747 8.595 24.847 8.352 C 24.948 8.109 25 7.849 25 7.587 C 25 7.324 24.948 7.064 24.847 6.821 C 24.747 6.578 24.6 6.358 24.414 6.172 Z M 2.414 17.001 L 13 6.415 L 15.086 8.501 L 4.5 19.086 L 2.414 17.001 Z M 2 19.415 L 5.586 23.001 L 2 23.001 L 2 19.415 Z M 8 22.587 L 5.914 20.501 L 16.5 9.915 L 18.586 12.001 L 8 22.587 Z M 20 10.587 L 14.414 5.001 L 17.414 2.001 L 23 7.586 L 20 10.587 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 2.999)\"/>"
    },
    "PencilWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.561 6.027 L 17.975 0.441 C 17.836 0.301 17.67 0.19 17.488 0.115 C 17.305 0.039 17.11 0 16.913 0 C 16.715 0 16.52 0.039 16.337 0.115 C 16.155 0.19 15.989 0.301 15.85 0.441 L 0.44 15.856 C 0.3 15.995 0.189 16.16 0.114 16.342 C 0.038 16.524 -0.001 16.719 0 16.916 L 0 22.502 C 0 22.9 0.158 23.282 0.439 23.563 C 0.721 23.844 1.102 24.002 1.5 24.002 L 7.086 24.002 C 7.484 24.002 7.865 23.845 8.146 23.564 L 23.56 8.149 C 23.7 8.009 23.811 7.844 23.887 7.661 C 23.962 7.479 24.001 7.284 24.001 7.086 C 24.001 6.889 23.962 6.693 23.887 6.511 C 23.811 6.329 23.7 6.163 23.56 6.024 L 23.561 6.027 Z M 1.208 16.502 L 12.5 5.209 L 15.293 8.002 L 4 19.295 L 1.208 16.502 Z M 1 22.502 L 1 17.71 L 3.646 20.356 L 6.293 23.002 L 1.5 23.002 C 1.367 23.002 1.24 22.95 1.146 22.856 C 1.053 22.762 1 22.635 1 22.502 Z M 7.5 22.795 L 4.708 20.002 L 16 8.709 L 18.793 11.502 L 7.5 22.795 Z M 22.854 7.441 L 19.5 10.795 L 13.208 4.502 L 16.56 1.149 C 16.606 1.102 16.662 1.065 16.722 1.04 C 16.783 1.015 16.848 1.002 16.914 1.002 C 16.979 1.002 17.045 1.015 17.105 1.04 C 17.166 1.065 17.221 1.102 17.268 1.149 L 22.854 6.734 C 22.9 6.78 22.937 6.835 22.962 6.896 C 22.987 6.957 23 7.022 23 7.087 C 23 7.153 22.987 7.218 22.962 7.279 C 22.937 7.34 22.9 7.395 22.854 7.441 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 3.498)\"/>"
    },
    "PlusWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25 12.5 C 25 12.898 24.842 13.279 24.561 13.561 C 24.279 13.842 23.898 14 23.5 14 L 14 14 L 14 23.5 C 14 23.898 13.842 24.279 13.561 24.561 C 13.279 24.842 12.898 25 12.5 25 C 12.102 25 11.721 24.842 11.439 24.561 C 11.158 24.279 11 23.898 11 23.5 L 11 14 L 1.5 14 C 1.102 14 0.721 13.842 0.439 13.561 C 0.158 13.279 0 12.898 0 12.5 C 0 12.102 0.158 11.721 0.439 11.439 C 0.721 11.158 1.102 11 1.5 11 L 11 11 L 11 1.5 C 11 1.102 11.158 0.721 11.439 0.439 C 11.721 0.158 12.102 0 12.5 0 C 12.898 0 13.279 0.158 13.561 0.439 C 13.842 0.721 14 1.102 14 1.5 L 14 11 L 23.5 11 C 23.898 11 24.279 11.158 24.561 11.439 C 24.842 11.721 25 12.102 25 12.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 3.500)\"/>"
    },
    "PlusWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 1 L 22 21 C 22 21.265 21.895 21.52 21.707 21.707 C 21.52 21.895 21.265 22 21 22 L 1 22 C 0.735 22 0.48 21.895 0.293 21.707 C 0.105 21.52 0 21.265 0 21 L 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 21 0 C 21.265 0 21.52 0.105 21.707 0.293 C 21.895 0.48 22 0.735 22 1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 5)\"/><path d=\"M 24 12 C 24 12.265 23.895 12.52 23.707 12.707 C 23.52 12.895 23.265 13 23 13 L 13 13 L 13 23 C 13 23.265 12.895 23.52 12.707 23.707 C 12.52 23.895 12.265 24 12 24 C 11.735 24 11.48 23.895 11.293 23.707 C 11.105 23.52 11 23.265 11 23 L 11 13 L 1 13 C 0.735 13 0.48 12.895 0.293 12.707 C 0.105 12.52 0 12.265 0 12 C 0 11.735 0.105 11.48 0.293 11.293 C 0.48 11.105 0.735 11 1 11 L 11 11 L 11 1 C 11 0.735 11.105 0.48 11.293 0.293 C 11.48 0.105 11.735 0 12 0 C 12.265 0 12.52 0.105 12.707 0.293 C 12.895 0.48 13 0.735 13 1 L 13 11 L 23 11 C 23.265 11 23.52 11.105 23.707 11.293 C 23.895 11.48 24 11.735 24 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
    },
    "PlusWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 0 L 2 0 C 1.47 0 0.961 0.211 0.586 0.586 C 0.211 0.961 0 1.47 0 2 L 0 22 C 0 22.53 0.211 23.039 0.586 23.414 C 0.961 23.789 1.47 24 2 24 L 22 24 C 22.53 24 23.039 23.789 23.414 23.414 C 23.789 23.039 24 22.53 24 22 L 24 2 C 24 1.47 23.789 0.961 23.414 0.586 C 23.039 0.211 22.53 0 22 0 Z M 19 13 L 13 13 L 13 19 C 13 19.265 12.895 19.52 12.707 19.707 C 12.52 19.895 12.265 20 12 20 C 11.735 20 11.48 19.895 11.293 19.707 C 11.105 19.52 11 19.265 11 19 L 11 13 L 5 13 C 4.735 13 4.48 12.895 4.293 12.707 C 4.105 12.52 4 12.265 4 12 C 4 11.735 4.105 11.48 4.293 11.293 C 4.48 11.105 4.735 11 5 11 L 11 11 L 11 5 C 11 4.735 11.105 4.48 11.293 4.293 C 11.48 4.105 11.735 4 12 4 C 12.265 4 12.52 4.105 12.707 4.293 C 12.895 4.48 13 4.735 13 5 L 13 11 L 19 11 C 19.265 11 19.52 11.105 19.707 11.293 C 19.895 11.48 20 11.735 20 12 C 20 12.265 19.895 12.52 19.707 12.707 C 19.52 12.895 19.265 13 19 13 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
    },
    "PlusWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23.5 11.75 C 23.5 11.949 23.421 12.14 23.28 12.28 C 23.14 12.421 22.949 12.5 22.75 12.5 L 12.5 12.5 L 12.5 22.75 C 12.5 22.949 12.421 23.14 12.28 23.28 C 12.14 23.421 11.949 23.5 11.75 23.5 C 11.551 23.5 11.36 23.421 11.22 23.28 C 11.079 23.14 11 22.949 11 22.75 L 11 12.5 L 0.75 12.5 C 0.551 12.5 0.36 12.421 0.22 12.28 C 0.079 12.14 0 11.949 0 11.75 C 0 11.551 0.079 11.36 0.22 11.22 C 0.36 11.079 0.551 11 0.75 11 L 11 11 L 11 0.75 C 11 0.551 11.079 0.36 11.22 0.22 C 11.36 0.079 11.551 0 11.75 0 C 11.949 0 12.14 0.079 12.28 0.22 C 12.421 0.36 12.5 0.551 12.5 0.75 L 12.5 11 L 22.75 11 C 22.949 11 23.14 11.079 23.28 11.22 C 23.421 11.36 23.5 11.551 23.5 11.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.250 4.250)\"/>"
    },
    "PlusWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 12 C 24 12.265 23.895 12.52 23.707 12.707 C 23.52 12.895 23.265 13 23 13 L 13 13 L 13 23 C 13 23.265 12.895 23.52 12.707 23.707 C 12.52 23.895 12.265 24 12 24 C 11.735 24 11.48 23.895 11.293 23.707 C 11.105 23.52 11 23.265 11 23 L 11 13 L 1 13 C 0.735 13 0.48 12.895 0.293 12.707 C 0.105 12.52 0 12.265 0 12 C 0 11.735 0.105 11.48 0.293 11.293 C 0.48 11.105 0.735 11 1 11 L 11 11 L 11 1 C 11 0.735 11.105 0.48 11.293 0.293 C 11.48 0.105 11.735 0 12 0 C 12.265 0 12.52 0.105 12.707 0.293 C 12.895 0.48 13 0.735 13 1 L 13 11 L 23 11 C 23.265 11 23.52 11.105 23.707 11.293 C 23.895 11.48 24 11.735 24 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
    },
    "PlusWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 23 11.5 C 23 11.633 22.947 11.76 22.854 11.854 C 22.76 11.947 22.633 12 22.5 12 L 12 12 L 12 22.5 C 12 22.633 11.947 22.76 11.854 22.854 C 11.76 22.947 11.633 23 11.5 23 C 11.367 23 11.24 22.947 11.146 22.854 C 11.053 22.76 11 22.633 11 22.5 L 11 12 L 0.5 12 C 0.367 12 0.24 11.947 0.146 11.854 C 0.053 11.76 0 11.633 0 11.5 C 0 11.367 0.053 11.24 0.146 11.146 C 0.24 11.053 0.367 11 0.5 11 L 11 11 L 11 0.5 C 11 0.367 11.053 0.24 11.146 0.146 C 11.24 0.053 11.367 0 11.5 0 C 11.633 0 11.76 0.053 11.854 0.146 C 11.947 0.24 12 0.367 12 0.5 L 12 11 L 22.5 11 C 22.633 11 22.76 11.053 22.854 11.146 C 22.947 11.24 23 11.367 23 11.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.500 4.500)\"/>"
    },
    "PositiveCircle": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 14.031 6.969 C 14.1 7.039 14.156 7.122 14.193 7.213 C 14.231 7.304 14.251 7.401 14.251 7.5 C 14.251 7.599 14.231 7.696 14.193 7.787 C 14.156 7.878 14.1 7.961 14.031 8.031 L 8.781 13.281 C 8.711 13.35 8.628 13.406 8.537 13.443 C 8.446 13.481 8.349 13.501 8.25 13.501 C 8.151 13.501 8.054 13.481 7.963 13.443 C 7.872 13.406 7.789 13.35 7.719 13.281 L 5.469 11.031 C 5.329 10.89 5.25 10.699 5.25 10.5 C 5.25 10.301 5.329 10.11 5.469 9.969 C 5.61 9.829 5.801 9.75 6 9.75 C 6.199 9.75 6.39 9.829 6.531 9.969 L 8.25 11.69 L 12.969 6.969 C 13.039 6.9 13.122 6.844 13.213 6.807 C 13.304 6.769 13.401 6.749 13.5 6.749 C 13.599 6.749 13.696 6.769 13.787 6.807 C 13.878 6.844 13.961 6.9 14.031 6.969 Z M 19.5 9.75 C 19.5 11.678 18.928 13.563 17.857 15.167 C 16.785 16.77 15.263 18.02 13.481 18.758 C 11.7 19.496 9.739 19.689 7.848 19.313 C 5.957 18.936 4.219 18.008 2.856 16.644 C 1.492 15.281 0.564 13.543 0.187 11.652 C -0.189 9.761 0.004 7.8 0.742 6.019 C 1.48 4.237 2.73 2.715 4.333 1.643 C 5.937 0.572 7.822 0 9.75 0 C 12.335 0.003 14.813 1.031 16.641 2.859 C 18.469 4.687 19.497 7.165 19.5 9.75 Z M 18 9.75 C 18 8.118 17.516 6.523 16.61 5.167 C 15.703 3.81 14.415 2.752 12.907 2.128 C 11.4 1.504 9.741 1.34 8.141 1.659 C 6.54 1.977 5.07 2.763 3.916 3.916 C 2.763 5.07 1.977 6.54 1.659 8.141 C 1.34 9.741 1.504 11.4 2.128 12.907 C 2.752 14.415 3.81 15.703 5.167 16.61 C 6.523 17.516 8.118 18 9.75 18 C 11.937 17.998 14.034 17.128 15.581 15.581 C 17.128 14.034 17.998 11.937 18 9.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "PositiveSolid": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.75 0 C 7.822 0 5.937 0.572 4.333 1.643 C 2.73 2.715 1.48 4.237 0.742 6.019 C 0.004 7.8 -0.189 9.761 0.187 11.652 C 0.564 13.543 1.492 15.281 2.856 16.644 C 4.219 18.008 5.957 18.936 7.848 19.313 C 9.739 19.689 11.7 19.496 13.481 18.758 C 15.263 18.02 16.785 16.77 17.857 15.167 C 18.928 13.563 19.5 11.678 19.5 9.75 C 19.497 7.165 18.469 4.687 16.641 2.859 C 14.813 1.031 12.335 0.003 9.75 0 Z M 14.031 8.031 L 8.781 13.281 C 8.711 13.35 8.628 13.406 8.537 13.443 C 8.446 13.481 8.349 13.501 8.25 13.501 C 8.151 13.501 8.054 13.481 7.963 13.443 C 7.872 13.406 7.789 13.35 7.719 13.281 L 5.469 11.031 C 5.329 10.89 5.25 10.699 5.25 10.5 C 5.25 10.301 5.329 10.11 5.469 9.969 C 5.61 9.829 5.801 9.75 6 9.75 C 6.199 9.75 6.39 9.829 6.531 9.969 L 8.25 11.69 L 12.969 6.969 C 13.039 6.9 13.122 6.844 13.213 6.807 C 13.304 6.769 13.401 6.75 13.5 6.75 C 13.599 6.75 13.696 6.769 13.787 6.807 C 13.878 6.844 13.961 6.9 14.031 6.969 C 14.1 7.039 14.156 7.122 14.193 7.213 C 14.231 7.304 14.25 7.401 14.25 7.5 C 14.25 7.599 14.231 7.696 14.193 7.787 C 14.156 7.878 14.1 7.961 14.031 8.031 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "QuestionCircle": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 10.875 14.625 C 10.875 14.848 10.809 15.065 10.685 15.25 C 10.562 15.435 10.386 15.579 10.181 15.664 C 9.975 15.75 9.749 15.772 9.531 15.728 C 9.312 15.685 9.112 15.578 8.955 15.42 C 8.797 15.263 8.69 15.063 8.647 14.844 C 8.603 14.626 8.625 14.4 8.711 14.194 C 8.796 13.989 8.94 13.813 9.125 13.69 C 9.31 13.566 9.528 13.5 9.75 13.5 C 10.048 13.5 10.335 13.619 10.545 13.83 C 10.756 14.04 10.875 14.327 10.875 14.625 Z M 9.75 4.5 C 7.682 4.5 6 6.014 6 7.875 L 6 8.25 C 6 8.449 6.079 8.64 6.22 8.78 C 6.36 8.921 6.551 9 6.75 9 C 6.949 9 7.14 8.921 7.28 8.78 C 7.421 8.64 7.5 8.449 7.5 8.25 L 7.5 7.875 C 7.5 6.844 8.51 6 9.75 6 C 10.99 6 12 6.844 12 7.875 C 12 8.906 10.99 9.75 9.75 9.75 C 9.551 9.75 9.36 9.829 9.22 9.97 C 9.079 10.11 9 10.301 9 10.5 L 9 11.25 C 9 11.449 9.079 11.64 9.22 11.78 C 9.36 11.921 9.551 12 9.75 12 C 9.949 12 10.14 11.921 10.28 11.78 C 10.421 11.64 10.5 11.449 10.5 11.25 L 10.5 11.182 C 12.21 10.868 13.5 9.504 13.5 7.875 C 13.5 6.014 11.818 4.5 9.75 4.5 Z M 19.5 9.75 C 19.5 11.678 18.928 13.563 17.857 15.167 C 16.785 16.77 15.263 18.02 13.481 18.758 C 11.7 19.496 9.739 19.689 7.848 19.313 C 5.957 18.936 4.219 18.008 2.856 16.644 C 1.492 15.281 0.564 13.543 0.187 11.652 C -0.189 9.761 0.004 7.8 0.742 6.019 C 1.48 4.237 2.73 2.715 4.333 1.643 C 5.937 0.572 7.822 0 9.75 0 C 12.335 0.003 14.813 1.031 16.641 2.859 C 18.469 4.687 19.497 7.165 19.5 9.75 Z M 18 9.75 C 18 8.118 17.516 6.523 16.61 5.167 C 15.703 3.81 14.415 2.752 12.907 2.128 C 11.4 1.504 9.741 1.34 8.141 1.659 C 6.54 1.977 5.07 2.763 3.916 3.916 C 2.763 5.07 1.977 6.54 1.659 8.141 C 1.34 9.741 1.504 11.4 2.128 12.907 C 2.752 14.415 3.81 15.703 5.167 16.61 C 6.523 17.516 8.118 18 9.75 18 C 11.937 17.998 14.034 17.128 15.581 15.581 C 17.128 14.034 17.998 11.937 18 9.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "QuestionSolid": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.75 0 C 7.822 0 5.937 0.572 4.333 1.643 C 2.73 2.715 1.48 4.237 0.742 6.019 C 0.004 7.8 -0.189 9.761 0.187 11.652 C 0.564 13.543 1.492 15.281 2.856 16.644 C 4.219 18.008 5.957 18.936 7.848 19.313 C 9.739 19.689 11.7 19.496 13.481 18.758 C 15.263 18.02 16.785 16.77 17.857 15.167 C 18.928 13.563 19.5 11.678 19.5 9.75 C 19.497 7.165 18.469 4.687 16.641 2.859 C 14.813 1.031 12.335 0.003 9.75 0 Z M 9.75 15.75 C 9.528 15.75 9.31 15.684 9.125 15.56 C 8.94 15.437 8.796 15.261 8.711 15.056 C 8.625 14.85 8.603 14.624 8.647 14.406 C 8.69 14.187 8.797 13.987 8.955 13.83 C 9.112 13.672 9.312 13.565 9.531 13.522 C 9.749 13.478 9.975 13.5 10.181 13.586 C 10.386 13.671 10.562 13.815 10.685 14 C 10.809 14.185 10.875 14.402 10.875 14.625 C 10.875 14.923 10.756 15.21 10.545 15.42 C 10.335 15.631 10.048 15.75 9.75 15.75 Z M 10.5 11.182 L 10.5 11.25 C 10.5 11.449 10.421 11.64 10.28 11.78 C 10.14 11.921 9.949 12 9.75 12 C 9.551 12 9.36 11.921 9.22 11.78 C 9.079 11.64 9 11.449 9 11.25 L 9 10.5 C 9 10.301 9.079 10.11 9.22 9.97 C 9.36 9.829 9.551 9.75 9.75 9.75 C 10.99 9.75 12 8.906 12 7.875 C 12 6.844 10.99 6 9.75 6 C 8.51 6 7.5 6.844 7.5 7.875 L 7.5 8.25 C 7.5 8.449 7.421 8.64 7.28 8.78 C 7.14 8.921 6.949 9 6.75 9 C 6.551 9 6.36 8.921 6.22 8.78 C 6.079 8.64 6 8.449 6 8.25 L 6 7.875 C 6 6.014 7.682 4.5 9.75 4.5 C 11.818 4.5 13.5 6.014 13.5 7.875 C 13.5 9.504 12.21 10.868 10.5 11.182 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "Search": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 19.301 18.24 L 14.607 13.547 C 15.968 11.914 16.646 9.819 16.501 7.698 C 16.357 5.577 15.4 3.593 13.83 2.16 C 12.26 0.727 10.198 -0.046 8.073 0.002 C 5.947 0.05 3.923 0.916 2.419 2.419 C 0.916 3.923 0.05 5.947 0.002 8.073 C -0.046 10.198 0.727 12.26 2.16 13.83 C 3.593 15.4 5.577 16.357 7.698 16.501 C 9.819 16.646 11.914 15.968 13.547 14.607 L 18.24 19.301 C 18.31 19.371 18.393 19.426 18.484 19.464 C 18.575 19.502 18.672 19.521 18.771 19.521 C 18.869 19.521 18.967 19.502 19.058 19.464 C 19.149 19.426 19.232 19.371 19.301 19.301 C 19.371 19.232 19.426 19.149 19.464 19.058 C 19.502 18.967 19.521 18.869 19.521 18.771 C 19.521 18.672 19.502 18.575 19.464 18.484 C 19.426 18.393 19.371 18.31 19.301 18.24 Z M 1.521 8.271 C 1.521 6.936 1.917 5.631 2.658 4.521 C 3.4 3.411 4.454 2.545 5.688 2.035 C 6.921 1.524 8.278 1.39 9.588 1.65 C 10.897 1.911 12.1 2.554 13.044 3.498 C 13.988 4.442 14.631 5.644 14.891 6.954 C 15.151 8.263 15.018 9.62 14.507 10.854 C 13.996 12.087 13.131 13.141 12.021 13.883 C 10.911 14.625 9.606 15.021 8.271 15.021 C 6.481 15.019 4.765 14.307 3.5 13.042 C 2.235 11.776 1.523 10.06 1.521 8.271 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.229 2.229)\"/>"
    },
    "SpinnerWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 15 1.5 L 15 5.5 C 15 5.898 14.842 6.279 14.561 6.561 C 14.279 6.842 13.898 7 13.5 7 C 13.102 7 12.721 6.842 12.439 6.561 C 12.158 6.279 12 5.898 12 5.5 L 12 1.5 C 12 1.102 12.158 0.721 12.439 0.439 C 12.721 0.158 13.102 0 13.5 0 C 13.898 0 14.279 0.158 14.561 0.439 C 14.842 0.721 15 1.102 15 1.5 Z M 19.156 9.344 C 19.353 9.344 19.549 9.305 19.731 9.229 C 19.913 9.154 20.078 9.043 20.218 8.904 L 23.046 6.075 C 23.328 5.793 23.486 5.411 23.486 5.012 C 23.486 4.614 23.328 4.232 23.046 3.95 C 22.764 3.668 22.382 3.51 21.984 3.51 C 21.585 3.51 21.203 3.668 20.921 3.95 L 18.096 6.783 C 17.886 6.992 17.743 7.259 17.685 7.55 C 17.627 7.841 17.657 8.143 17.77 8.417 C 17.884 8.692 18.076 8.926 18.323 9.091 C 18.569 9.256 18.86 9.344 19.156 9.344 Z M 25.5 12 L 21.5 12 C 21.102 12 20.721 12.158 20.439 12.439 C 20.158 12.721 20 13.102 20 13.5 C 20 13.898 20.158 14.279 20.439 14.561 C 20.721 14.842 21.102 15 21.5 15 L 25.5 15 C 25.898 15 26.279 14.842 26.561 14.561 C 26.842 14.279 27 13.898 27 13.5 C 27 13.102 26.842 12.721 26.561 12.439 C 26.279 12.158 25.898 12 25.5 12 Z M 20.218 18.096 C 20.078 17.957 19.912 17.846 19.73 17.771 C 19.548 17.695 19.352 17.656 19.155 17.656 C 18.958 17.656 18.762 17.695 18.58 17.771 C 18.398 17.846 18.232 17.957 18.093 18.096 C 17.953 18.236 17.842 18.401 17.767 18.584 C 17.691 18.766 17.652 18.961 17.652 19.159 C 17.652 19.356 17.691 19.551 17.767 19.734 C 17.842 19.916 17.953 20.082 18.093 20.221 L 20.921 23.05 C 21.203 23.332 21.585 23.49 21.984 23.49 C 22.382 23.49 22.764 23.332 23.046 23.05 C 23.328 22.768 23.486 22.386 23.486 21.987 C 23.486 21.589 23.328 21.207 23.046 20.925 L 20.218 18.096 Z M 13.5 20 C 13.102 20 12.721 20.158 12.439 20.439 C 12.158 20.721 12 21.102 12 21.5 L 12 25.5 C 12 25.898 12.158 26.279 12.439 26.561 C 12.721 26.842 13.102 27 13.5 27 C 13.898 27 14.279 26.842 14.561 26.561 C 14.842 26.279 15 25.898 15 25.5 L 15 21.5 C 15 21.102 14.842 20.721 14.561 20.439 C 14.279 20.158 13.898 20 13.5 20 Z M 6.783 18.096 L 3.954 20.925 C 3.672 21.207 3.514 21.589 3.514 21.987 C 3.514 22.386 3.672 22.768 3.954 23.05 C 4.236 23.332 4.618 23.49 5.016 23.49 C 5.415 23.49 5.797 23.332 6.079 23.05 L 8.908 20.221 C 9.189 19.939 9.348 19.557 9.348 19.159 C 9.348 18.76 9.189 18.378 8.908 18.096 C 8.626 17.814 8.244 17.656 7.845 17.656 C 7.446 17.656 7.064 17.814 6.783 18.096 Z M 7 13.5 C 7 13.102 6.842 12.721 6.561 12.439 C 6.279 12.158 5.898 12 5.5 12 L 1.5 12 C 1.102 12 0.721 12.158 0.439 12.439 C 0.158 12.721 0 13.102 0 13.5 C 0 13.898 0.158 14.279 0.439 14.561 C 0.721 14.842 1.102 15 1.5 15 L 5.5 15 C 5.898 15 6.279 14.842 6.561 14.561 C 6.842 14.279 7 13.898 7 13.5 Z M 6.075 3.954 C 5.793 3.672 5.411 3.514 5.012 3.514 C 4.614 3.514 4.232 3.672 3.95 3.954 C 3.668 4.236 3.51 4.618 3.51 5.016 C 3.51 5.415 3.668 5.797 3.95 6.079 L 6.783 8.904 C 7.064 9.186 7.446 9.344 7.845 9.344 C 8.244 9.344 8.626 9.186 8.908 8.904 C 9.189 8.622 9.348 8.24 9.348 7.841 C 9.348 7.443 9.189 7.061 8.908 6.779 L 6.075 3.954 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.500 2.500)\"/>"
    },
    "SpinnerWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 12 C 24 14.373 23.296 16.693 21.978 18.667 C 20.659 20.64 18.785 22.178 16.592 23.087 C 14.399 23.995 11.987 24.232 9.659 23.769 C 7.331 23.306 5.193 22.164 3.515 20.485 C 1.836 18.807 0.694 16.669 0.231 14.341 C -0.232 12.013 0.005 9.601 0.913 7.408 C 1.822 5.215 3.36 3.341 5.333 2.022 C 7.307 0.704 9.627 0 12 0 C 15.183 0 18.235 1.264 20.485 3.515 C 22.736 5.765 24 8.817 24 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/><path d=\"M 14 1 L 14 5 C 14 5.265 13.895 5.52 13.707 5.707 C 13.52 5.895 13.265 6 13 6 C 12.735 6 12.48 5.895 12.293 5.707 C 12.105 5.52 12 5.265 12 5 L 12 1 C 12 0.735 12.105 0.48 12.293 0.293 C 12.48 0.105 12.735 0 13 0 C 13.265 0 13.52 0.105 13.707 0.293 C 13.895 0.48 14 0.735 14 1 Z M 18.656 8.344 C 18.788 8.344 18.918 8.318 19.039 8.267 C 19.161 8.217 19.271 8.143 19.364 8.05 L 22.192 5.222 C 22.38 5.035 22.486 4.78 22.486 4.515 C 22.486 4.25 22.38 3.995 22.192 3.807 C 22.005 3.62 21.75 3.514 21.485 3.514 C 21.22 3.514 20.965 3.62 20.778 3.807 L 17.95 6.636 C 17.81 6.776 17.715 6.954 17.676 7.148 C 17.637 7.342 17.657 7.543 17.733 7.726 C 17.808 7.909 17.936 8.065 18.101 8.175 C 18.265 8.285 18.458 8.344 18.656 8.344 Z M 25 12 L 21 12 C 20.735 12 20.48 12.105 20.293 12.293 C 20.105 12.48 20 12.735 20 13 C 20 13.265 20.105 13.52 20.293 13.707 C 20.48 13.895 20.735 14 21 14 L 25 14 C 25.265 14 25.52 13.895 25.707 13.707 C 25.895 13.52 26 13.265 26 13 C 26 12.735 25.895 12.48 25.707 12.293 C 25.52 12.105 25.265 12 25 12 Z M 19.364 17.95 C 19.175 17.77 18.923 17.672 18.662 17.675 C 18.401 17.678 18.152 17.783 17.968 17.968 C 17.783 18.152 17.678 18.401 17.675 18.662 C 17.672 18.923 17.77 19.175 17.95 19.364 L 20.778 22.192 C 20.965 22.38 21.22 22.486 21.485 22.486 C 21.75 22.486 22.005 22.38 22.192 22.192 C 22.38 22.005 22.486 21.75 22.486 21.485 C 22.486 21.22 22.38 20.965 22.192 20.778 L 19.364 17.95 Z M 13 20 C 12.735 20 12.48 20.105 12.293 20.293 C 12.105 20.48 12 20.735 12 21 L 12 25 C 12 25.265 12.105 25.52 12.293 25.707 C 12.48 25.895 12.735 26 13 26 C 13.265 26 13.52 25.895 13.707 25.707 C 13.895 25.52 14 25.265 14 25 L 14 21 C 14 20.735 13.895 20.48 13.707 20.293 C 13.52 20.105 13.265 20 13 20 Z M 6.636 17.95 L 3.807 20.778 C 3.62 20.965 3.514 21.22 3.514 21.485 C 3.514 21.75 3.62 22.005 3.807 22.192 C 3.995 22.38 4.25 22.486 4.515 22.486 C 4.78 22.486 5.035 22.38 5.222 22.192 L 8.05 19.364 C 8.23 19.175 8.328 18.923 8.325 18.662 C 8.322 18.401 8.217 18.152 8.032 17.968 C 7.848 17.783 7.599 17.678 7.338 17.675 C 7.077 17.672 6.825 17.77 6.636 17.95 Z M 6 13 C 6 12.735 5.895 12.48 5.707 12.293 C 5.52 12.105 5.265 12 5 12 L 1 12 C 0.735 12 0.48 12.105 0.293 12.293 C 0.105 12.48 0 12.735 0 13 C 0 13.265 0.105 13.52 0.293 13.707 C 0.48 13.895 0.735 14 1 14 L 5 14 C 5.265 14 5.52 13.895 5.707 13.707 C 5.895 13.52 6 13.265 6 13 Z M 5.222 3.807 C 5.035 3.62 4.78 3.514 4.515 3.514 C 4.25 3.514 3.995 3.62 3.807 3.807 C 3.62 3.995 3.514 4.25 3.514 4.515 C 3.514 4.78 3.62 5.035 3.807 5.222 L 6.636 8.05 C 6.825 8.23 7.077 8.328 7.338 8.325 C 7.599 8.322 7.848 8.217 8.032 8.032 C 8.217 7.848 8.322 7.599 8.325 7.338 C 8.328 7.077 8.23 6.825 8.05 6.636 L 5.222 3.807 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "SpinnerWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 17.243 7.344 L 19.368 5.219 C 19.555 5.031 19.81 4.926 20.075 4.926 C 20.34 4.926 20.595 5.031 20.783 5.219 C 20.97 5.406 21.076 5.661 21.076 5.926 C 21.076 6.192 20.97 6.446 20.783 6.634 L 18.658 8.759 C 18.468 8.938 18.217 9.037 17.956 9.034 C 17.695 9.03 17.446 8.925 17.262 8.741 C 17.077 8.556 16.972 8.307 16.969 8.047 C 16.965 7.786 17.064 7.534 17.244 7.345 L 17.243 7.344 Z M 3 14 C 2.735 14 2.48 13.895 2.293 13.707 C 2.105 13.52 2 13.265 2 13 C 2 12.735 2.105 12.48 2.293 12.293 C 2.48 12.105 2.735 12 3 12 L 6 12 C 6.265 12 6.52 12.105 6.707 12.293 C 6.895 12.48 7 12.735 7 13 C 7 13.265 6.895 13.52 6.707 13.707 C 6.52 13.895 6.265 14 6 14 L 3 14 Z M 8.758 18.656 L 6.633 20.781 C 6.54 20.874 6.429 20.948 6.308 20.998 C 6.187 21.048 6.056 21.074 5.925 21.074 C 5.794 21.074 5.664 21.048 5.542 20.998 C 5.421 20.948 5.31 20.874 5.218 20.781 C 5.125 20.688 5.051 20.578 5.001 20.457 C 4.95 20.335 4.924 20.205 4.924 20.074 C 4.924 19.942 4.95 19.812 5.001 19.691 C 5.051 19.569 5.125 19.459 5.218 19.366 L 7.343 17.241 C 7.532 17.062 7.783 16.963 8.044 16.966 C 8.305 16.97 8.554 17.075 8.738 17.259 C 8.923 17.444 9.028 17.693 9.031 17.953 C 9.035 18.214 8.936 18.466 8.756 18.655 L 8.758 18.656 Z M 8.758 8.757 C 8.57 8.945 8.316 9.05 8.051 9.05 C 7.786 9.05 7.531 8.945 7.344 8.757 L 5.219 6.632 C 5.126 6.539 5.053 6.429 5.003 6.308 C 4.953 6.186 4.927 6.056 4.927 5.925 C 4.928 5.659 5.034 5.405 5.222 5.218 C 5.41 5.031 5.664 4.926 5.93 4.927 C 6.195 4.927 6.449 5.033 6.636 5.221 L 8.761 7.346 C 8.947 7.534 9.051 7.788 9.051 8.053 C 9.05 8.317 8.945 8.571 8.758 8.757 Z M 14 23 C 14 23.265 13.895 23.52 13.707 23.707 C 13.52 23.895 13.265 24 13 24 C 12.735 24 12.48 23.895 12.293 23.707 C 12.105 23.52 12 23.265 12 23 L 12 20 C 12 19.735 12.105 19.48 12.293 19.293 C 12.48 19.105 12.735 19 13 19 C 13.265 19 13.52 19.105 13.707 19.293 C 13.895 19.48 14 19.735 14 20 L 14 23 Z M 14 6 C 14 6.265 13.895 6.52 13.707 6.707 C 13.52 6.895 13.265 7 13 7 C 12.735 7 12.48 6.895 12.293 6.707 C 12.105 6.52 12 6.265 12 6 L 12 3 C 12 2.735 12.105 2.48 12.293 2.293 C 12.48 2.105 12.735 2 13 2 C 13.265 2 13.52 2.105 13.707 2.293 C 13.895 2.48 14 2.735 14 3 L 14 6 Z M 20.779 20.779 C 20.686 20.872 20.576 20.945 20.454 20.996 C 20.333 21.046 20.203 21.072 20.071 21.072 C 19.94 21.072 19.81 21.046 19.688 20.996 C 19.567 20.945 19.457 20.872 19.364 20.779 L 17.239 18.654 C 17.059 18.465 16.96 18.213 16.964 17.952 C 16.967 17.691 17.072 17.442 17.257 17.258 C 17.441 17.073 17.69 16.968 17.951 16.965 C 18.212 16.962 18.463 17.06 18.653 17.24 L 20.778 19.365 C 20.965 19.552 21.071 19.807 21.071 20.072 C 21.071 20.337 20.966 20.591 20.779 20.779 Z M 23 14 L 20 14 C 19.735 14 19.48 13.895 19.293 13.707 C 19.105 13.52 19 13.265 19 13 C 19 12.735 19.105 12.48 19.293 12.293 C 19.48 12.105 19.735 12 20 12 L 23 12 C 23.265 12 23.52 12.105 23.707 12.293 C 23.895 12.48 24 12.735 24 13 C 24 13.265 23.895 13.52 23.707 13.707 C 23.52 13.895 23.265 14 23 14 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "SpinnerWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13.5 0.75 L 13.5 4.75 C 13.5 4.949 13.421 5.14 13.28 5.28 C 13.14 5.421 12.949 5.5 12.75 5.5 C 12.551 5.5 12.36 5.421 12.22 5.28 C 12.079 5.14 12 4.949 12 4.75 L 12 0.75 C 12 0.551 12.079 0.36 12.22 0.22 C 12.36 0.079 12.551 0 12.75 0 C 12.949 0 13.14 0.079 13.28 0.22 C 13.421 0.36 13.5 0.551 13.5 0.75 Z M 18.406 7.844 C 18.505 7.844 18.602 7.825 18.694 7.787 C 18.785 7.75 18.868 7.695 18.938 7.625 L 21.765 4.796 C 21.897 4.654 21.97 4.466 21.966 4.272 C 21.963 4.077 21.884 3.892 21.747 3.755 C 21.609 3.617 21.424 3.539 21.23 3.535 C 21.035 3.532 20.847 3.604 20.705 3.736 L 17.875 6.563 C 17.77 6.667 17.698 6.801 17.669 6.947 C 17.64 7.092 17.655 7.243 17.711 7.38 C 17.768 7.518 17.864 7.635 17.988 7.717 C 18.111 7.8 18.257 7.844 18.405 7.844 L 18.406 7.844 Z M 24.75 12 L 20.75 12 C 20.551 12 20.36 12.079 20.22 12.22 C 20.079 12.36 20 12.551 20 12.75 C 20 12.949 20.079 13.14 20.22 13.28 C 20.36 13.421 20.551 13.5 20.75 13.5 L 24.75 13.5 C 24.949 13.5 25.14 13.421 25.28 13.28 C 25.421 13.14 25.5 12.949 25.5 12.75 C 25.5 12.551 25.421 12.36 25.28 12.22 C 25.14 12.079 24.949 12 24.75 12 Z M 18.938 17.875 C 18.797 17.734 18.606 17.655 18.406 17.655 C 18.207 17.655 18.016 17.734 17.875 17.875 C 17.734 18.016 17.655 18.207 17.655 18.406 C 17.655 18.606 17.734 18.797 17.875 18.938 L 20.704 21.765 C 20.846 21.897 21.034 21.97 21.228 21.966 C 21.423 21.963 21.608 21.884 21.745 21.747 C 21.883 21.609 21.961 21.424 21.965 21.23 C 21.968 21.035 21.896 20.847 21.764 20.705 L 18.938 17.875 Z M 12.75 20 C 12.551 20 12.36 20.079 12.22 20.22 C 12.079 20.36 12 20.551 12 20.75 L 12 24.75 C 12 24.949 12.079 25.14 12.22 25.28 C 12.36 25.421 12.551 25.5 12.75 25.5 C 12.949 25.5 13.14 25.421 13.28 25.28 C 13.421 25.14 13.5 24.949 13.5 24.75 L 13.5 20.75 C 13.5 20.551 13.421 20.36 13.28 20.22 C 13.14 20.079 12.949 20 12.75 20 Z M 6.563 17.875 L 3.735 20.705 C 3.661 20.774 3.602 20.856 3.561 20.948 C 3.52 21.04 3.498 21.14 3.496 21.24 C 3.495 21.341 3.513 21.441 3.551 21.535 C 3.589 21.628 3.645 21.713 3.716 21.784 C 3.787 21.855 3.872 21.911 3.965 21.949 C 4.059 21.987 4.159 22.005 4.26 22.004 C 4.36 22.002 4.46 21.98 4.552 21.939 C 4.644 21.898 4.726 21.839 4.795 21.765 L 7.625 18.938 C 7.695 18.868 7.75 18.785 7.788 18.694 C 7.826 18.603 7.845 18.505 7.845 18.406 C 7.845 18.308 7.826 18.21 7.788 18.119 C 7.75 18.028 7.695 17.945 7.625 17.875 C 7.555 17.805 7.472 17.75 7.381 17.712 C 7.29 17.674 7.192 17.655 7.094 17.655 C 6.995 17.655 6.897 17.674 6.806 17.712 C 6.715 17.75 6.632 17.805 6.563 17.875 Z M 5.5 12.75 C 5.5 12.551 5.421 12.36 5.28 12.22 C 5.14 12.079 4.949 12 4.75 12 L 0.75 12 C 0.551 12 0.36 12.079 0.22 12.22 C 0.079 12.36 0 12.551 0 12.75 C 0 12.949 0.079 13.14 0.22 13.28 C 0.36 13.421 0.551 13.5 0.75 13.5 L 4.75 13.5 C 4.949 13.5 5.14 13.421 5.28 13.28 C 5.421 13.14 5.5 12.949 5.5 12.75 Z M 4.795 3.735 C 4.653 3.603 4.465 3.53 4.27 3.534 C 4.076 3.537 3.891 3.616 3.753 3.753 C 3.616 3.891 3.537 4.076 3.534 4.27 C 3.53 4.465 3.603 4.653 3.735 4.795 L 6.563 7.625 C 6.703 7.766 6.894 7.845 7.094 7.845 C 7.293 7.845 7.484 7.766 7.625 7.625 C 7.766 7.484 7.845 7.293 7.845 7.094 C 7.845 6.894 7.766 6.703 7.625 6.563 L 4.795 3.735 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.250 3.250)\"/>"
    },
    "SpinnerWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 14 1 L 14 5 C 14 5.265 13.895 5.52 13.707 5.707 C 13.52 5.895 13.265 6 13 6 C 12.735 6 12.48 5.895 12.293 5.707 C 12.105 5.52 12 5.265 12 5 L 12 1 C 12 0.735 12.105 0.48 12.293 0.293 C 12.48 0.105 12.735 0 13 0 C 13.265 0 13.52 0.105 13.707 0.293 C 13.895 0.48 14 0.735 14 1 Z M 18.656 8.344 C 18.788 8.344 18.918 8.318 19.039 8.267 C 19.161 8.217 19.271 8.143 19.364 8.05 L 22.192 5.222 C 22.38 5.035 22.486 4.78 22.486 4.515 C 22.486 4.25 22.38 3.995 22.192 3.807 C 22.005 3.62 21.75 3.514 21.485 3.514 C 21.22 3.514 20.965 3.62 20.778 3.807 L 17.95 6.636 C 17.81 6.776 17.715 6.954 17.676 7.148 C 17.637 7.342 17.657 7.543 17.733 7.726 C 17.808 7.909 17.936 8.065 18.101 8.175 C 18.265 8.285 18.458 8.344 18.656 8.344 Z M 25 12 L 21 12 C 20.735 12 20.48 12.105 20.293 12.293 C 20.105 12.48 20 12.735 20 13 C 20 13.265 20.105 13.52 20.293 13.707 C 20.48 13.895 20.735 14 21 14 L 25 14 C 25.265 14 25.52 13.895 25.707 13.707 C 25.895 13.52 26 13.265 26 13 C 26 12.735 25.895 12.48 25.707 12.293 C 25.52 12.105 25.265 12 25 12 Z M 19.364 17.95 C 19.175 17.77 18.923 17.672 18.662 17.675 C 18.401 17.678 18.152 17.783 17.968 17.968 C 17.783 18.152 17.678 18.401 17.675 18.662 C 17.672 18.923 17.77 19.175 17.95 19.364 L 20.778 22.192 C 20.965 22.38 21.22 22.486 21.485 22.486 C 21.75 22.486 22.005 22.38 22.192 22.192 C 22.38 22.005 22.486 21.75 22.486 21.485 C 22.486 21.22 22.38 20.965 22.192 20.778 L 19.364 17.95 Z M 13 20 C 12.735 20 12.48 20.105 12.293 20.293 C 12.105 20.48 12 20.735 12 21 L 12 25 C 12 25.265 12.105 25.52 12.293 25.707 C 12.48 25.895 12.735 26 13 26 C 13.265 26 13.52 25.895 13.707 25.707 C 13.895 25.52 14 25.265 14 25 L 14 21 C 14 20.735 13.895 20.48 13.707 20.293 C 13.52 20.105 13.265 20 13 20 Z M 6.636 17.95 L 3.807 20.778 C 3.62 20.965 3.514 21.22 3.514 21.485 C 3.514 21.75 3.62 22.005 3.807 22.192 C 3.995 22.38 4.25 22.486 4.515 22.486 C 4.78 22.486 5.035 22.38 5.222 22.192 L 8.05 19.364 C 8.23 19.175 8.328 18.923 8.325 18.662 C 8.322 18.401 8.217 18.152 8.032 17.968 C 7.848 17.783 7.599 17.678 7.338 17.675 C 7.077 17.672 6.825 17.77 6.636 17.95 Z M 6 13 C 6 12.735 5.895 12.48 5.707 12.293 C 5.52 12.105 5.265 12 5 12 L 1 12 C 0.735 12 0.48 12.105 0.293 12.293 C 0.105 12.48 0 12.735 0 13 C 0 13.265 0.105 13.52 0.293 13.707 C 0.48 13.895 0.735 14 1 14 L 5 14 C 5.265 14 5.52 13.895 5.707 13.707 C 5.895 13.52 6 13.265 6 13 Z M 5.222 3.807 C 5.035 3.62 4.78 3.514 4.515 3.514 C 4.25 3.514 3.995 3.62 3.807 3.807 C 3.62 3.995 3.514 4.25 3.514 4.515 C 3.514 4.78 3.62 5.035 3.807 5.222 L 6.636 8.05 C 6.825 8.23 7.077 8.328 7.338 8.325 C 7.599 8.322 7.848 8.217 8.032 8.032 C 8.217 7.848 8.322 7.599 8.325 7.338 C 8.328 7.077 8.23 6.825 8.05 6.636 L 5.222 3.807 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "SpinnerWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13 0.5 L 13 4.5 C 13 4.633 12.947 4.76 12.854 4.854 C 12.76 4.947 12.633 5 12.5 5 C 12.367 5 12.24 4.947 12.146 4.854 C 12.053 4.76 12 4.633 12 4.5 L 12 0.5 C 12 0.367 12.053 0.24 12.146 0.146 C 12.24 0.053 12.367 0 12.5 0 C 12.633 0 12.76 0.053 12.854 0.146 C 12.947 0.24 13 0.367 13 0.5 Z M 18.156 7.344 C 18.222 7.344 18.287 7.331 18.348 7.305 C 18.409 7.28 18.464 7.243 18.51 7.196 L 21.339 4.375 C 21.433 4.281 21.485 4.154 21.485 4.021 C 21.485 3.889 21.433 3.761 21.339 3.668 C 21.245 3.574 21.118 3.521 20.985 3.521 C 20.852 3.521 20.725 3.574 20.631 3.668 L 17.804 6.49 C 17.734 6.56 17.686 6.649 17.667 6.746 C 17.647 6.843 17.657 6.943 17.695 7.035 C 17.733 7.126 17.797 7.204 17.879 7.259 C 17.961 7.314 18.057 7.344 18.156 7.344 Z M 24.5 12 L 20.5 12 C 20.367 12 20.24 12.053 20.146 12.146 C 20.053 12.24 20 12.367 20 12.5 C 20 12.633 20.053 12.76 20.146 12.854 C 20.24 12.947 20.367 13 20.5 13 L 24.5 13 C 24.633 13 24.76 12.947 24.854 12.854 C 24.947 12.76 25 12.633 25 12.5 C 25 12.367 24.947 12.24 24.854 12.146 C 24.76 12.053 24.633 12 24.5 12 Z M 18.51 17.804 C 18.465 17.754 18.409 17.713 18.348 17.685 C 18.286 17.657 18.219 17.641 18.152 17.64 C 18.084 17.638 18.017 17.65 17.954 17.675 C 17.891 17.7 17.834 17.738 17.786 17.786 C 17.738 17.834 17.7 17.891 17.675 17.954 C 17.65 18.017 17.638 18.084 17.64 18.152 C 17.641 18.219 17.657 18.286 17.685 18.348 C 17.713 18.409 17.754 18.465 17.804 18.51 L 20.631 21.339 C 20.725 21.433 20.852 21.485 20.985 21.485 C 21.118 21.485 21.245 21.433 21.339 21.339 C 21.433 21.245 21.485 21.118 21.485 20.985 C 21.485 20.852 21.433 20.725 21.339 20.631 L 18.51 17.804 Z M 12.5 20 C 12.367 20 12.24 20.053 12.146 20.146 C 12.053 20.24 12 20.367 12 20.5 L 12 24.5 C 12 24.633 12.053 24.76 12.146 24.854 C 12.24 24.947 12.367 25 12.5 25 C 12.633 25 12.76 24.947 12.854 24.854 C 12.947 24.76 13 24.633 13 24.5 L 13 20.5 C 13 20.367 12.947 20.24 12.854 20.146 C 12.76 20.053 12.633 20 12.5 20 Z M 6.49 17.804 L 3.661 20.631 C 3.615 20.678 3.578 20.734 3.553 20.795 C 3.528 20.856 3.515 20.921 3.516 20.987 C 3.516 21.053 3.529 21.118 3.555 21.179 C 3.58 21.24 3.618 21.295 3.664 21.342 C 3.711 21.388 3.767 21.425 3.828 21.45 C 3.889 21.475 3.954 21.488 4.02 21.487 C 4.086 21.487 4.152 21.474 4.212 21.448 C 4.273 21.423 4.329 21.386 4.375 21.339 L 7.203 18.51 C 7.253 18.465 7.293 18.409 7.321 18.348 C 7.35 18.286 7.365 18.219 7.367 18.152 C 7.368 18.084 7.356 18.017 7.331 17.954 C 7.306 17.891 7.268 17.834 7.22 17.786 C 7.172 17.738 7.115 17.7 7.052 17.675 C 6.99 17.65 6.922 17.638 6.854 17.64 C 6.787 17.641 6.72 17.657 6.659 17.685 C 6.597 17.713 6.542 17.754 6.496 17.804 L 6.49 17.804 Z M 5 12.5 C 5 12.367 4.947 12.24 4.854 12.146 C 4.76 12.053 4.633 12 4.5 12 L 0.5 12 C 0.367 12 0.24 12.053 0.146 12.146 C 0.053 12.24 0 12.367 0 12.5 C 0 12.633 0.053 12.76 0.146 12.854 C 0.24 12.947 0.367 13 0.5 13 L 4.5 13 C 4.633 13 4.76 12.947 4.854 12.854 C 4.947 12.76 5 12.633 5 12.5 Z M 4.375 3.661 C 4.28 3.567 4.152 3.513 4.018 3.513 C 3.884 3.513 3.756 3.567 3.661 3.661 C 3.567 3.756 3.513 3.884 3.513 4.018 C 3.513 4.152 3.567 4.28 3.661 4.375 L 6.49 7.196 C 6.535 7.246 6.591 7.287 6.652 7.315 C 6.714 7.343 6.781 7.359 6.848 7.36 C 6.916 7.362 6.983 7.35 7.046 7.325 C 7.109 7.3 7.166 7.262 7.214 7.214 C 7.262 7.166 7.3 7.109 7.325 7.046 C 7.35 6.983 7.362 6.916 7.36 6.848 C 7.359 6.781 7.343 6.714 7.315 6.652 C 7.287 6.591 7.246 6.535 7.196 6.49 L 4.375 3.661 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 3.500)\"/>"
    },
    "StarWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 28.882 10.497 C 28.73 10.031 28.445 9.62 28.061 9.315 C 27.678 9.01 27.213 8.825 26.725 8.782 L 19.6 8.166 L 16.812 1.523 C 16.621 1.071 16.3 0.686 15.891 0.415 C 15.482 0.144 15.002 0 14.511 0 C 14.02 0 13.541 0.144 13.131 0.415 C 12.722 0.686 12.402 1.071 12.21 1.523 L 9.419 8.166 L 2.294 8.782 C 1.803 8.823 1.335 9.007 0.949 9.313 C 0.563 9.618 0.275 10.031 0.123 10.499 C -0.03 10.968 -0.04 11.47 0.092 11.945 C 0.224 12.419 0.493 12.844 0.866 13.166 L 6.281 17.891 L 4.656 24.921 C 4.545 25.399 4.577 25.9 4.749 26.361 C 4.92 26.821 5.224 27.221 5.622 27.51 C 6.019 27.799 6.493 27.964 6.984 27.985 C 7.475 28.006 7.962 27.882 8.382 27.628 L 14.507 23.908 L 20.632 27.628 C 21.053 27.882 21.539 28.005 22.03 27.984 C 22.521 27.963 22.995 27.798 23.392 27.509 C 23.79 27.22 24.093 26.82 24.265 26.36 C 24.436 25.9 24.469 25.399 24.357 24.921 L 22.732 17.891 L 28.147 13.166 C 28.519 12.843 28.787 12.417 28.918 11.942 C 29.049 11.467 29.036 10.965 28.882 10.497 Z M 20.539 15.824 C 20.196 16.123 19.941 16.509 19.801 16.941 C 19.661 17.373 19.642 17.836 19.745 18.278 L 21.169 24.443 L 15.801 21.183 C 15.411 20.946 14.964 20.82 14.507 20.82 C 14.051 20.82 13.603 20.946 13.214 21.183 L 7.846 24.443 L 9.27 18.278 C 9.373 17.836 9.354 17.373 9.214 16.941 C 9.074 16.509 8.819 16.123 8.476 15.824 L 3.715 11.671 L 9.982 11.128 C 10.436 11.089 10.871 10.927 11.239 10.658 C 11.607 10.389 11.894 10.025 12.069 9.604 L 14.507 3.793 L 16.946 9.604 C 17.121 10.025 17.408 10.389 17.776 10.658 C 18.144 10.927 18.579 11.089 19.032 11.128 L 25.3 11.671 L 20.539 15.824 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.493 1.509)\"/>"
    },
    "StarWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 20.024 15.452 C 19.887 15.573 19.785 15.728 19.729 15.902 C 19.673 16.075 19.665 16.261 19.706 16.439 L 21.396 23.756 C 21.441 23.947 21.428 24.147 21.36 24.331 C 21.292 24.515 21.171 24.675 21.012 24.791 C 20.854 24.907 20.665 24.973 20.469 24.982 C 20.273 24.992 20.078 24.943 19.91 24.842 L 13.522 20.967 C 13.367 20.873 13.189 20.823 13.007 20.823 C 12.826 20.823 12.648 20.873 12.492 20.967 L 6.105 24.842 C 5.936 24.943 5.742 24.992 5.546 24.982 C 5.35 24.973 5.161 24.907 5.002 24.791 C 4.844 24.675 4.723 24.515 4.655 24.331 C 4.587 24.147 4.574 23.947 4.619 23.756 L 6.309 16.439 C 6.35 16.261 6.342 16.075 6.286 15.902 C 6.23 15.728 6.128 15.573 5.991 15.452 L 0.352 10.534 C 0.202 10.405 0.092 10.235 0.038 10.045 C -0.016 9.855 -0.012 9.653 0.048 9.464 C 0.109 9.276 0.224 9.11 0.379 8.987 C 0.535 8.865 0.723 8.791 0.92 8.775 L 8.352 8.132 C 8.534 8.116 8.707 8.051 8.854 7.943 C 9.001 7.836 9.116 7.69 9.186 7.522 L 12.09 0.602 C 12.167 0.423 12.296 0.271 12.459 0.164 C 12.622 0.057 12.812 0 13.007 0 C 13.202 0 13.393 0.057 13.556 0.164 C 13.719 0.271 13.847 0.423 13.925 0.602 L 16.829 7.522 C 16.899 7.69 17.014 7.836 17.161 7.943 C 17.308 8.051 17.481 8.116 17.662 8.132 L 25.095 8.775 C 25.292 8.791 25.48 8.865 25.635 8.987 C 25.79 9.11 25.906 9.276 25.966 9.464 C 26.027 9.653 26.031 9.855 25.977 10.045 C 25.922 10.235 25.813 10.405 25.662 10.534 L 20.024 15.452 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.993 3.010)\"/><path d=\"M 27.906 10.161 C 27.785 9.788 27.557 9.458 27.25 9.214 C 26.943 8.969 26.571 8.821 26.18 8.786 L 18.756 8.146 L 15.846 1.226 C 15.695 0.863 15.439 0.553 15.112 0.335 C 14.784 0.116 14.4 0 14.006 0 C 13.613 0 13.228 0.116 12.901 0.335 C 12.573 0.553 12.318 0.863 12.166 1.226 L 9.265 8.146 L 1.833 8.79 C 1.44 8.823 1.066 8.971 0.757 9.216 C 0.449 9.46 0.219 9.791 0.098 10.165 C -0.024 10.54 -0.032 10.942 0.074 11.321 C 0.18 11.7 0.396 12.04 0.694 12.297 L 6.333 17.225 L 4.643 24.542 C 4.553 24.925 4.579 25.326 4.716 25.694 C 4.853 26.063 5.096 26.383 5.414 26.614 C 5.732 26.845 6.111 26.978 6.504 26.995 C 6.897 27.012 7.286 26.913 7.623 26.71 L 13.998 22.835 L 20.386 26.71 C 20.723 26.913 21.112 27.012 21.505 26.995 C 21.898 26.978 22.277 26.845 22.595 26.614 C 22.913 26.383 23.156 26.063 23.293 25.694 C 23.43 25.326 23.456 24.925 23.366 24.542 L 21.678 17.217 L 27.315 12.297 C 27.613 12.039 27.828 11.699 27.934 11.319 C 28.039 10.938 28.029 10.536 27.906 10.161 Z M 26.004 10.786 L 20.366 15.706 C 20.092 15.945 19.888 16.254 19.776 16.6 C 19.664 16.946 19.649 17.316 19.731 17.67 L 21.425 25 L 15.041 21.125 C 14.73 20.935 14.372 20.835 14.008 20.835 C 13.643 20.835 13.285 20.935 12.974 21.125 L 6.599 25 L 8.281 17.675 C 8.364 17.321 8.349 16.951 8.237 16.605 C 8.125 16.259 7.921 15.95 7.646 15.711 L 2.006 10.794 C 2.006 10.79 2.006 10.786 2.006 10.782 L 9.436 10.14 C 9.799 10.108 10.146 9.977 10.44 9.763 C 10.734 9.548 10.964 9.257 11.105 8.921 L 14.006 2.01 L 16.906 8.921 C 17.047 9.257 17.277 9.548 17.571 9.763 C 17.865 9.977 18.212 10.108 18.575 10.14 L 26.006 10.782 C 26.006 10.782 26.006 10.79 26.006 10.791 L 26.004 10.786 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.994 2.000)\"/>"
    },
    "StarWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 27.319 12.297 L 21.681 17.217 L 23.37 24.542 C 23.459 24.925 23.434 25.326 23.297 25.694 C 23.16 26.063 22.917 26.383 22.599 26.614 C 22.281 26.845 21.902 26.978 21.509 26.995 C 21.116 27.012 20.727 26.913 20.39 26.71 L 14.001 22.835 L 7.626 26.71 C 7.289 26.913 6.9 27.012 6.507 26.995 C 6.115 26.978 5.736 26.845 5.418 26.614 C 5.1 26.383 4.857 26.063 4.72 25.694 C 4.582 25.326 4.557 24.925 4.646 24.542 L 6.333 17.225 L 0.694 12.297 C 0.396 12.04 0.18 11.7 0.074 11.321 C -0.032 10.942 -0.024 10.54 0.098 10.165 C 0.219 9.791 0.449 9.46 0.757 9.216 C 1.066 8.971 1.44 8.823 1.833 8.79 L 9.265 8.146 L 12.166 1.226 C 12.318 0.863 12.573 0.553 12.901 0.335 C 13.228 0.116 13.613 0 14.006 0 C 14.4 0 14.784 0.116 15.112 0.335 C 15.439 0.553 15.695 0.863 15.846 1.226 L 18.756 8.146 L 26.186 8.79 C 26.579 8.823 26.953 8.971 27.261 9.216 C 27.57 9.46 27.799 9.791 27.921 10.165 C 28.043 10.54 28.051 10.942 27.945 11.321 C 27.839 11.7 27.623 12.04 27.325 12.297 L 27.319 12.297 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.994 2.000)\"/>"
    },
    "StarWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 27.415 9.979 C 27.311 9.651 27.112 9.362 26.843 9.148 C 26.574 8.934 26.247 8.806 25.905 8.779 L 18.472 8.137 C 18.427 8.132 18.384 8.116 18.348 8.089 C 18.312 8.062 18.283 8.026 18.266 7.984 L 15.362 1.064 C 15.228 0.748 15.003 0.479 14.717 0.29 C 14.431 0.101 14.095 0 13.752 0 C 13.409 0 13.073 0.101 12.787 0.29 C 12.501 0.479 12.277 0.748 12.142 1.064 L 9.238 7.984 C 9.221 8.026 9.193 8.062 9.156 8.089 C 9.12 8.116 9.077 8.132 9.032 8.137 L 1.6 8.779 C 1.257 8.806 0.93 8.934 0.661 9.148 C 0.392 9.362 0.193 9.651 0.09 9.979 C -0.02 10.307 -0.029 10.661 0.062 10.995 C 0.154 11.328 0.342 11.627 0.603 11.854 L 6.242 16.773 C 6.277 16.804 6.302 16.843 6.316 16.887 C 6.33 16.931 6.332 16.978 6.322 17.023 L 4.627 24.337 C 4.548 24.673 4.571 25.026 4.692 25.35 C 4.813 25.674 5.028 25.955 5.308 26.157 C 5.585 26.361 5.916 26.477 6.259 26.491 C 6.602 26.505 6.942 26.415 7.233 26.234 L 13.622 22.359 C 13.66 22.336 13.703 22.324 13.747 22.324 C 13.791 22.324 13.835 22.336 13.872 22.359 L 20.261 26.234 C 20.556 26.415 20.898 26.504 21.243 26.49 C 21.588 26.477 21.922 26.361 22.202 26.158 C 22.482 25.955 22.695 25.674 22.816 25.35 C 22.936 25.026 22.957 24.673 22.877 24.337 L 21.187 17.02 C 21.177 16.975 21.179 16.928 21.193 16.884 C 21.207 16.84 21.233 16.801 21.267 16.77 L 26.906 11.852 C 27.166 11.625 27.353 11.326 27.444 10.992 C 27.534 10.659 27.524 10.307 27.415 9.979 Z M 25.915 10.719 L 20.276 15.638 C 20.036 15.847 19.857 16.118 19.759 16.421 C 19.661 16.724 19.648 17.048 19.721 17.358 L 21.411 24.674 C 21.423 24.723 21.421 24.775 21.403 24.823 C 21.385 24.87 21.354 24.911 21.312 24.94 C 21.275 24.97 21.228 24.988 21.18 24.99 C 21.132 24.992 21.085 24.978 21.045 24.952 L 14.656 21.077 C 14.384 20.911 14.071 20.824 13.752 20.824 C 13.433 20.824 13.121 20.911 12.848 21.077 L 6.46 24.952 C 6.42 24.978 6.372 24.992 6.324 24.99 C 6.276 24.988 6.23 24.97 6.192 24.94 C 6.151 24.911 6.119 24.87 6.101 24.823 C 6.084 24.775 6.081 24.723 6.093 24.674 L 7.783 17.358 C 7.856 17.048 7.843 16.724 7.745 16.421 C 7.647 16.118 7.469 15.847 7.228 15.638 L 1.59 10.719 C 1.551 10.686 1.523 10.643 1.51 10.594 C 1.497 10.545 1.499 10.493 1.516 10.445 C 1.529 10.398 1.556 10.356 1.594 10.325 C 1.632 10.294 1.679 10.275 1.728 10.273 L 9.162 9.63 C 9.48 9.603 9.785 9.49 10.043 9.302 C 10.302 9.114 10.504 8.859 10.627 8.564 L 13.531 1.644 C 13.551 1.601 13.583 1.565 13.623 1.539 C 13.663 1.514 13.71 1.5 13.757 1.5 C 13.805 1.5 13.851 1.514 13.891 1.539 C 13.931 1.565 13.963 1.601 13.983 1.644 L 16.877 8.564 C 17 8.858 17.202 9.113 17.459 9.3 C 17.716 9.488 18.02 9.602 18.337 9.63 L 25.771 10.273 C 25.82 10.275 25.867 10.294 25.905 10.325 C 25.943 10.356 25.971 10.398 25.983 10.445 C 26.001 10.493 26.004 10.544 25.991 10.593 C 25.979 10.642 25.952 10.686 25.915 10.719 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.248 2.258)\"/>"
    },
    "StarWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 27.906 10.161 C 27.785 9.788 27.557 9.458 27.25 9.214 C 26.943 8.969 26.571 8.821 26.18 8.786 L 18.756 8.146 L 15.846 1.226 C 15.695 0.863 15.439 0.553 15.112 0.335 C 14.784 0.116 14.4 0 14.006 0 C 13.613 0 13.228 0.116 12.901 0.335 C 12.573 0.553 12.318 0.863 12.166 1.226 L 9.265 8.146 L 1.833 8.79 C 1.44 8.823 1.066 8.971 0.757 9.216 C 0.449 9.46 0.219 9.791 0.098 10.165 C -0.024 10.54 -0.032 10.942 0.074 11.321 C 0.18 11.7 0.396 12.04 0.694 12.297 L 6.333 17.225 L 4.643 24.542 C 4.553 24.925 4.579 25.326 4.716 25.694 C 4.853 26.063 5.096 26.383 5.414 26.614 C 5.732 26.845 6.111 26.978 6.504 26.995 C 6.897 27.012 7.286 26.913 7.623 26.71 L 13.998 22.835 L 20.386 26.71 C 20.723 26.913 21.112 27.012 21.505 26.995 C 21.898 26.978 22.277 26.845 22.595 26.614 C 22.913 26.383 23.156 26.063 23.293 25.694 C 23.43 25.326 23.456 24.925 23.366 24.542 L 21.678 17.217 L 27.315 12.297 C 27.613 12.039 27.828 11.699 27.934 11.319 C 28.039 10.938 28.029 10.536 27.906 10.161 Z M 26.004 10.786 L 20.366 15.706 C 20.092 15.945 19.888 16.254 19.776 16.6 C 19.664 16.946 19.649 17.316 19.731 17.67 L 21.425 25 L 15.041 21.125 C 14.73 20.935 14.372 20.835 14.008 20.835 C 13.643 20.835 13.285 20.935 12.974 21.125 L 6.599 25 L 8.281 17.675 C 8.364 17.321 8.349 16.951 8.237 16.605 C 8.125 16.259 7.921 15.95 7.646 15.711 L 2.006 10.794 C 2.006 10.79 2.006 10.786 2.006 10.782 L 9.436 10.14 C 9.799 10.108 10.146 9.977 10.44 9.763 C 10.734 9.548 10.964 9.257 11.105 8.921 L 14.006 2.01 L 16.906 8.921 C 17.047 9.257 17.277 9.548 17.571 9.763 C 17.865 9.977 18.212 10.108 18.575 10.14 L 26.006 10.782 C 26.006 10.782 26.006 10.79 26.006 10.791 L 26.004 10.786 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.994 2.000)\"/>"
    },
    "StarWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 26.925 9.815 C 26.836 9.534 26.665 9.285 26.434 9.101 C 26.203 8.918 25.922 8.808 25.627 8.785 L 18.196 8.143 C 18.106 8.134 18.019 8.102 17.946 8.048 C 17.873 7.994 17.816 7.921 17.781 7.838 L 14.877 0.919 C 14.764 0.647 14.573 0.414 14.327 0.251 C 14.082 0.087 13.794 0 13.499 0 C 13.204 0 12.916 0.087 12.67 0.251 C 12.425 0.414 12.233 0.647 12.12 0.919 L 9.22 7.838 C 9.185 7.921 9.128 7.994 9.055 8.048 C 8.982 8.102 8.895 8.134 8.805 8.143 L 1.377 8.785 C 1.082 8.809 0.801 8.92 0.569 9.104 C 0.337 9.288 0.164 9.536 0.073 9.818 C -0.018 10.099 -0.024 10.402 0.056 10.687 C 0.136 10.971 0.299 11.226 0.524 11.419 L 6.161 16.338 C 6.232 16.398 6.284 16.477 6.312 16.565 C 6.34 16.653 6.343 16.748 6.321 16.838 L 4.627 24.152 C 4.558 24.44 4.576 24.743 4.68 25.021 C 4.784 25.299 4.969 25.54 5.211 25.712 C 5.448 25.886 5.731 25.986 6.025 25.998 C 6.319 26.01 6.61 25.933 6.86 25.778 L 13.247 21.903 C 13.324 21.856 13.412 21.831 13.502 21.831 C 13.592 21.831 13.681 21.856 13.757 21.903 L 20.145 25.778 C 20.397 25.929 20.689 26.003 20.983 25.99 C 21.277 25.977 21.561 25.877 21.799 25.704 C 22.037 25.531 22.219 25.291 22.322 25.015 C 22.424 24.74 22.444 24.44 22.377 24.153 L 20.687 16.835 C 20.665 16.745 20.668 16.651 20.697 16.563 C 20.725 16.474 20.777 16.396 20.847 16.335 L 26.485 11.417 C 26.709 11.224 26.871 10.968 26.949 10.683 C 27.028 10.398 27.019 10.096 26.925 9.815 Z M 25.827 10.665 L 20.19 15.584 C 19.984 15.763 19.83 15.995 19.746 16.255 C 19.662 16.515 19.65 16.793 19.712 17.059 L 21.402 24.374 C 21.426 24.471 21.42 24.573 21.385 24.666 C 21.351 24.76 21.289 24.841 21.207 24.899 C 21.129 24.957 21.036 24.99 20.939 24.994 C 20.842 24.997 20.746 24.972 20.664 24.92 L 14.276 21.045 C 14.043 20.903 13.775 20.828 13.502 20.828 C 13.229 20.828 12.962 20.903 12.729 21.045 L 6.341 24.92 C 6.259 24.972 6.163 24.997 6.066 24.994 C 5.969 24.99 5.875 24.957 5.797 24.899 C 5.716 24.841 5.654 24.76 5.62 24.666 C 5.585 24.573 5.579 24.471 5.602 24.374 L 7.292 17.057 C 7.355 16.79 7.343 16.512 7.259 16.253 C 7.175 15.993 7.021 15.761 6.815 15.582 L 1.177 10.665 C 1.102 10.6 1.047 10.514 1.021 10.417 C 0.994 10.321 0.998 10.219 1.03 10.124 C 1.06 10.031 1.117 9.949 1.193 9.888 C 1.27 9.827 1.362 9.789 1.46 9.78 L 8.891 9.138 C 9.163 9.114 9.423 9.016 9.643 8.855 C 9.863 8.694 10.036 8.476 10.141 8.224 L 13.044 1.304 C 13.083 1.215 13.147 1.14 13.228 1.087 C 13.309 1.034 13.404 1.006 13.501 1.006 C 13.598 1.006 13.693 1.034 13.774 1.087 C 13.855 1.14 13.92 1.215 13.959 1.304 L 16.861 8.224 C 16.967 8.476 17.139 8.694 17.359 8.855 C 17.579 9.016 17.839 9.114 18.111 9.138 L 25.542 9.78 C 25.64 9.789 25.733 9.827 25.809 9.888 C 25.885 9.949 25.942 10.031 25.972 10.124 C 26.005 10.218 26.009 10.32 25.983 10.417 C 25.957 10.513 25.903 10.6 25.827 10.665 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.498 2.501)\"/>"
    },
    "UserWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 26.821 23.754 C 25.107 20.746 22.431 18.402 19.224 17.1 C 20.819 15.904 21.997 14.236 22.592 12.333 C 23.186 10.429 23.167 8.387 22.536 6.496 C 21.906 4.604 20.696 2.959 19.078 1.793 C 17.461 0.627 15.518 0 13.524 0 C 11.53 0 9.587 0.627 7.969 1.793 C 6.351 2.959 5.142 4.604 4.511 6.496 C 3.881 8.387 3.861 10.429 4.456 12.333 C 5.05 14.236 6.229 15.904 7.824 17.1 C 4.616 18.402 1.94 20.746 0.226 23.754 C 0.12 23.925 0.049 24.115 0.018 24.314 C -0.013 24.512 -0.004 24.715 0.045 24.91 C 0.094 25.105 0.181 25.288 0.302 25.449 C 0.423 25.61 0.575 25.744 0.75 25.845 C 0.924 25.945 1.116 26.01 1.316 26.035 C 1.515 26.059 1.718 26.044 1.911 25.988 C 2.105 25.933 2.285 25.84 2.441 25.714 C 2.598 25.587 2.728 25.431 2.822 25.254 C 5.087 21.339 9.087 19.004 13.524 19.004 C 17.96 19.004 21.96 21.34 24.225 25.254 C 24.431 25.584 24.757 25.822 25.135 25.917 C 25.512 26.011 25.912 25.955 26.249 25.76 C 26.586 25.566 26.835 25.247 26.941 24.873 C 27.048 24.498 27.005 24.097 26.821 23.754 Z M 7.024 9.504 C 7.024 8.218 7.405 6.961 8.119 5.893 C 8.833 4.824 9.849 3.991 11.036 3.499 C 12.224 3.007 13.531 2.878 14.792 3.129 C 16.053 3.379 17.211 3.999 18.12 4.908 C 19.029 5.817 19.648 6.975 19.899 8.236 C 20.15 9.497 20.021 10.803 19.529 11.991 C 19.037 13.179 18.204 14.194 17.135 14.908 C 16.066 15.623 14.809 16.004 13.524 16.004 C 11.8 16.002 10.148 15.316 8.93 14.098 C 7.711 12.879 7.026 11.227 7.024 9.504 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.476 2.496)\"/>"
    },
    "UserWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 16 8 C 16 9.582 15.531 11.129 14.652 12.445 C 13.773 13.76 12.523 14.786 11.061 15.391 C 9.6 15.997 7.991 16.155 6.439 15.846 C 4.887 15.538 3.462 14.776 2.343 13.657 C 1.224 12.538 0.462 11.113 0.154 9.561 C -0.155 8.009 0.003 6.4 0.609 4.939 C 1.214 3.477 2.24 2.227 3.555 1.348 C 4.871 0.469 6.418 0 8 0 C 10.122 0 12.157 0.843 13.657 2.343 C 15.157 3.843 16 5.878 16 8 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8 4)\"/><path d=\"M 25.878 23.503 C 23.974 20.212 21.04 17.852 17.616 16.733 C 19.31 15.725 20.626 14.189 21.362 12.361 C 22.098 10.532 22.213 8.513 21.69 6.613 C 21.167 4.712 20.035 3.036 18.468 1.842 C 16.9 0.647 14.983 0 13.013 0 C 11.042 0 9.125 0.647 7.558 1.842 C 5.99 3.036 4.858 4.712 4.335 6.613 C 3.812 8.513 3.928 10.532 4.664 12.361 C 5.399 14.189 6.715 15.725 8.409 16.733 C 4.985 17.851 2.051 20.211 0.148 23.503 C 0.078 23.617 0.031 23.744 0.011 23.876 C -0.009 24.008 -0.002 24.143 0.031 24.272 C 0.064 24.402 0.122 24.523 0.203 24.63 C 0.283 24.736 0.384 24.825 0.5 24.892 C 0.615 24.959 0.743 25.002 0.876 25.018 C 1.008 25.035 1.143 25.025 1.271 24.989 C 1.4 24.952 1.52 24.891 1.624 24.808 C 1.728 24.724 1.815 24.621 1.879 24.503 C 4.234 20.433 8.396 18.003 13.013 18.003 C 17.629 18.003 21.791 20.433 24.146 24.503 C 24.21 24.621 24.297 24.724 24.401 24.808 C 24.505 24.891 24.625 24.952 24.754 24.989 C 24.882 25.025 25.017 25.035 25.149 25.018 C 25.282 25.002 25.41 24.959 25.525 24.892 C 25.641 24.825 25.742 24.736 25.823 24.63 C 25.903 24.523 25.962 24.402 25.994 24.272 C 26.027 24.143 26.034 24.008 26.014 23.876 C 25.994 23.744 25.947 23.617 25.878 23.503 Z M 6.013 9.003 C 6.013 7.619 6.423 6.266 7.192 5.114 C 7.961 3.963 9.055 3.066 10.334 2.536 C 11.613 2.006 13.02 1.868 14.378 2.138 C 15.736 2.408 16.983 3.075 17.962 4.054 C 18.941 5.033 19.608 6.28 19.878 7.638 C 20.148 8.996 20.01 10.403 19.48 11.682 C 18.95 12.961 18.053 14.055 16.902 14.824 C 15.75 15.593 14.397 16.003 13.013 16.003 C 11.157 16.001 9.377 15.263 8.065 13.951 C 6.753 12.639 6.015 10.859 6.013 9.003 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.987 2.997)\"/>"
    },
    "UserWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25.865 24.503 C 25.777 24.655 25.651 24.782 25.499 24.869 C 25.347 24.957 25.175 25.003 24.999 25.003 L 0.999 25.003 C 0.824 25.003 0.651 24.957 0.499 24.869 C 0.347 24.781 0.221 24.655 0.134 24.503 C 0.046 24.351 0 24.179 0 24.003 C 0 23.828 0.046 23.655 0.134 23.503 C 2.038 20.212 4.971 17.852 8.395 16.733 C 6.702 15.725 5.386 14.189 4.65 12.361 C 3.914 10.532 3.799 8.513 4.321 6.613 C 4.844 4.712 5.976 3.036 7.544 1.842 C 9.112 0.647 11.028 0 12.999 0 C 14.97 0 16.886 0.647 18.454 1.842 C 20.022 3.036 21.154 4.712 21.677 6.613 C 22.199 8.513 22.084 10.532 21.348 12.361 C 20.612 14.189 19.296 15.725 17.603 16.733 C 21.026 17.852 23.96 20.212 25.864 23.503 C 25.952 23.655 25.998 23.828 25.999 24.003 C 25.999 24.179 25.953 24.351 25.865 24.503 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.001 2.997)\"/>"
    },
    "UserWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25.415 23.378 C 23.438 19.963 20.336 17.566 16.731 16.55 C 18.483 15.659 19.885 14.204 20.709 12.419 C 21.534 10.634 21.733 8.623 21.275 6.711 C 20.817 4.799 19.728 3.097 18.185 1.88 C 16.641 0.662 14.732 0 12.766 0 C 10.8 0 8.891 0.662 7.347 1.88 C 5.803 3.097 4.715 4.799 4.257 6.711 C 3.799 8.623 3.998 10.634 4.822 12.419 C 5.647 14.204 7.048 15.659 8.801 16.55 C 5.196 17.565 2.093 19.961 0.117 23.378 C 0.063 23.463 0.026 23.558 0.01 23.658 C -0.006 23.758 -0.003 23.86 0.022 23.958 C 0.046 24.057 0.089 24.149 0.15 24.23 C 0.211 24.311 0.287 24.379 0.375 24.429 C 0.462 24.48 0.559 24.512 0.66 24.524 C 0.76 24.537 0.862 24.528 0.959 24.5 C 1.056 24.472 1.147 24.425 1.225 24.36 C 1.303 24.296 1.368 24.217 1.415 24.128 C 3.816 19.979 8.058 17.503 12.766 17.503 C 17.473 17.503 21.716 19.979 24.117 24.128 C 24.164 24.217 24.228 24.296 24.307 24.36 C 24.385 24.425 24.476 24.472 24.573 24.5 C 24.67 24.528 24.772 24.537 24.872 24.524 C 24.972 24.512 25.069 24.48 25.157 24.429 C 25.245 24.379 25.321 24.311 25.382 24.23 C 25.442 24.149 25.486 24.057 25.51 23.958 C 25.534 23.86 25.538 23.758 25.522 23.658 C 25.505 23.558 25.469 23.463 25.415 23.378 Z M 5.516 8.753 C 5.516 7.319 5.941 5.917 6.738 4.725 C 7.534 3.532 8.667 2.603 9.991 2.054 C 11.316 1.506 12.774 1.362 14.18 1.642 C 15.587 1.922 16.878 2.612 17.892 3.626 C 18.906 4.64 19.597 5.932 19.877 7.338 C 20.156 8.745 20.013 10.202 19.464 11.527 C 18.915 12.852 17.986 13.984 16.794 14.781 C 15.601 15.577 14.2 16.003 12.766 16.003 C 10.844 16 9.001 15.236 7.642 13.877 C 6.283 12.517 5.518 10.675 5.516 8.753 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.234 3.247)\"/>"
    },
    "UserWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 25.878 23.503 C 23.974 20.212 21.04 17.852 17.616 16.733 C 19.31 15.725 20.626 14.189 21.362 12.361 C 22.098 10.532 22.213 8.513 21.69 6.613 C 21.167 4.712 20.035 3.036 18.468 1.842 C 16.9 0.647 14.983 0 13.013 0 C 11.042 0 9.125 0.647 7.558 1.842 C 5.99 3.036 4.858 4.712 4.335 6.613 C 3.812 8.513 3.928 10.532 4.664 12.361 C 5.399 14.189 6.715 15.725 8.409 16.733 C 4.985 17.851 2.051 20.211 0.148 23.503 C 0.078 23.617 0.031 23.744 0.011 23.876 C -0.009 24.008 -0.002 24.143 0.031 24.272 C 0.064 24.402 0.122 24.523 0.203 24.63 C 0.283 24.736 0.384 24.825 0.5 24.892 C 0.615 24.959 0.743 25.002 0.876 25.018 C 1.008 25.035 1.143 25.025 1.271 24.989 C 1.4 24.952 1.52 24.891 1.624 24.808 C 1.728 24.724 1.815 24.621 1.879 24.503 C 4.234 20.433 8.396 18.003 13.013 18.003 C 17.629 18.003 21.791 20.433 24.146 24.503 C 24.21 24.621 24.297 24.724 24.401 24.808 C 24.505 24.891 24.625 24.952 24.754 24.989 C 24.882 25.025 25.017 25.035 25.149 25.018 C 25.282 25.002 25.41 24.959 25.525 24.892 C 25.641 24.825 25.742 24.736 25.823 24.63 C 25.903 24.523 25.962 24.402 25.994 24.272 C 26.027 24.143 26.034 24.008 26.014 23.876 C 25.994 23.744 25.947 23.617 25.878 23.503 Z M 6.013 9.003 C 6.013 7.619 6.423 6.266 7.192 5.114 C 7.961 3.963 9.055 3.066 10.334 2.536 C 11.613 2.006 13.02 1.868 14.378 2.138 C 15.736 2.408 16.983 3.075 17.962 4.054 C 18.941 5.033 19.608 6.28 19.878 7.638 C 20.148 8.996 20.01 10.403 19.48 11.682 C 18.95 12.961 18.053 14.055 16.902 14.824 C 15.75 15.593 14.397 16.003 13.013 16.003 C 11.157 16.001 9.377 15.263 8.065 13.951 C 6.753 12.639 6.015 10.859 6.013 9.003 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.987 2.997)\"/>"
    },
    "UserWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24.922 23.252 C 22.857 19.682 19.547 17.244 15.712 16.365 C 17.534 15.619 19.041 14.263 19.974 12.529 C 20.908 10.794 21.21 8.79 20.829 6.858 C 20.449 4.926 19.409 3.185 17.888 1.935 C 16.367 0.684 14.459 0 12.489 0 C 10.52 0 8.612 0.684 7.091 1.935 C 5.57 3.185 4.53 4.926 4.15 6.858 C 3.769 8.79 4.071 10.794 5.005 12.529 C 5.938 14.263 7.445 15.619 9.267 16.365 C 5.437 17.24 2.122 19.682 0.057 23.252 C -0.003 23.366 -0.016 23.499 0.02 23.623 C 0.056 23.747 0.138 23.852 0.25 23.916 C 0.361 23.981 0.494 24 0.619 23.969 C 0.744 23.938 0.853 23.861 0.922 23.752 C 3.364 19.525 7.692 17.002 12.489 17.002 C 17.287 17.002 21.614 19.525 24.057 23.752 C 24.101 23.828 24.164 23.891 24.24 23.935 C 24.316 23.978 24.402 24.002 24.489 24.002 C 24.577 24.002 24.664 23.979 24.739 23.934 C 24.854 23.868 24.938 23.759 24.972 23.631 C 25.006 23.503 24.988 23.366 24.922 23.252 Z M 4.989 8.502 C 4.989 7.018 5.429 5.568 6.253 4.335 C 7.078 3.102 8.249 2.14 9.619 1.573 C 10.99 1.005 12.498 0.856 13.953 1.146 C 15.407 1.435 16.744 2.15 17.793 3.198 C 18.842 4.247 19.556 5.584 19.845 7.039 C 20.135 8.493 19.986 10.001 19.419 11.372 C 18.851 12.742 17.89 13.914 16.656 14.738 C 15.423 15.562 13.973 16.002 12.489 16.002 C 10.501 15.999 8.595 15.208 7.189 13.802 C 5.783 12.396 4.992 10.49 4.989 8.502 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.511 3.498)\"/>"
    },
    "WarningCircleWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13.5 0 C 10.83 0 8.22 0.792 6 2.275 C 3.78 3.759 2.049 5.867 1.028 8.334 C 0.006 10.801 -0.261 13.515 0.259 16.134 C 0.78 18.752 2.066 21.158 3.954 23.046 C 5.842 24.934 8.248 26.22 10.866 26.741 C 13.485 27.262 16.199 26.994 18.666 25.972 C 21.133 24.951 23.241 23.22 24.725 21 C 26.208 18.78 27 16.17 27 13.5 C 26.996 9.921 25.572 6.489 23.042 3.958 C 20.511 1.428 17.079 0.004 13.5 0 Z M 13.5 24 C 11.423 24 9.393 23.384 7.667 22.23 C 5.94 21.077 4.594 19.437 3.799 17.518 C 3.005 15.6 2.797 13.488 3.202 11.452 C 3.607 9.415 4.607 7.544 6.075 6.075 C 7.544 4.607 9.415 3.607 11.452 3.202 C 13.488 2.797 15.6 3.005 17.518 3.799 C 19.437 4.594 21.077 5.94 22.23 7.667 C 23.384 9.393 24 11.423 24 13.5 C 23.997 16.284 22.89 18.953 20.921 20.921 C 18.953 22.89 16.284 23.997 13.5 24 Z M 12 14 L 12 7.5 C 12 7.102 12.158 6.721 12.439 6.439 C 12.721 6.158 13.102 6 13.5 6 C 13.898 6 14.279 6.158 14.561 6.439 C 14.842 6.721 15 7.102 15 7.5 L 15 14 C 15 14.398 14.842 14.779 14.561 15.061 C 14.279 15.342 13.898 15.5 13.5 15.5 C 13.102 15.5 12.721 15.342 12.439 15.061 C 12.158 14.779 12 14.398 12 14 Z M 15.5 19 C 15.5 19.396 15.383 19.782 15.163 20.111 C 14.943 20.44 14.631 20.696 14.265 20.848 C 13.9 20.999 13.498 21.039 13.11 20.962 C 12.722 20.884 12.365 20.694 12.086 20.414 C 11.806 20.135 11.616 19.778 11.538 19.39 C 11.461 19.002 11.501 18.6 11.652 18.235 C 11.804 17.869 12.06 17.557 12.389 17.337 C 12.718 17.117 13.104 17 13.5 17 C 14.03 17 14.539 17.211 14.914 17.586 C 15.289 17.961 15.5 18.47 15.5 19 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.500 2.500)\"/>"
    },
    "WarningCircleWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 24 12 C 24 14.373 23.296 16.693 21.978 18.667 C 20.659 20.64 18.785 22.178 16.592 23.087 C 14.399 23.995 11.987 24.232 9.659 23.769 C 7.331 23.306 5.193 22.164 3.515 20.485 C 1.836 18.807 0.694 16.669 0.231 14.341 C -0.232 12.013 0.005 9.601 0.913 7.408 C 1.822 5.215 3.36 3.341 5.333 2.022 C 7.307 0.704 9.627 0 12 0 C 15.183 0 18.235 1.264 20.485 3.515 C 22.736 5.765 24 8.817 24 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/><path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 13 24 C 10.824 24 8.698 23.355 6.889 22.146 C 5.08 20.937 3.67 19.22 2.837 17.21 C 2.005 15.2 1.787 12.988 2.211 10.854 C 2.636 8.72 3.683 6.76 5.222 5.222 C 6.76 3.683 8.72 2.636 10.854 2.211 C 12.988 1.787 15.2 2.005 17.21 2.837 C 19.22 3.67 20.937 5.08 22.146 6.889 C 23.355 8.698 24 10.824 24 13 C 23.997 15.916 22.837 18.712 20.775 20.775 C 18.712 22.837 15.916 23.997 13 24 Z M 12 14 L 12 7 C 12 6.735 12.105 6.48 12.293 6.293 C 12.48 6.105 12.735 6 13 6 C 13.265 6 13.52 6.105 13.707 6.293 C 13.895 6.48 14 6.735 14 7 L 14 14 C 14 14.265 13.895 14.52 13.707 14.707 C 13.52 14.895 13.265 15 13 15 C 12.735 15 12.48 14.895 12.293 14.707 C 12.105 14.52 12 14.265 12 14 Z M 14.5 18.5 C 14.5 18.797 14.412 19.087 14.247 19.333 C 14.082 19.58 13.848 19.772 13.574 19.886 C 13.3 19.999 12.998 20.029 12.707 19.971 C 12.416 19.913 12.149 19.77 11.939 19.561 C 11.73 19.351 11.587 19.084 11.529 18.793 C 11.471 18.502 11.501 18.2 11.614 17.926 C 11.728 17.652 11.92 17.418 12.167 17.253 C 12.413 17.088 12.703 17 13 17 C 13.398 17 13.779 17.158 14.061 17.439 C 14.342 17.721 14.5 18.102 14.5 18.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "WarningCircleWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 12 7 C 12 6.735 12.105 6.48 12.293 6.293 C 12.48 6.105 12.735 6 13 6 C 13.265 6 13.52 6.105 13.707 6.293 C 13.895 6.48 14 6.735 14 7 L 14 14 C 14 14.265 13.895 14.52 13.707 14.707 C 13.52 14.895 13.265 15 13 15 C 12.735 15 12.48 14.895 12.293 14.707 C 12.105 14.52 12 14.265 12 14 L 12 7 Z M 13 20 C 12.703 20 12.413 19.912 12.167 19.747 C 11.92 19.582 11.728 19.348 11.614 19.074 C 11.501 18.8 11.471 18.498 11.529 18.207 C 11.587 17.916 11.73 17.649 11.939 17.439 C 12.149 17.23 12.416 17.087 12.707 17.029 C 12.998 16.971 13.3 17.001 13.574 17.114 C 13.848 17.228 14.082 17.42 14.247 17.667 C 14.412 17.913 14.5 18.203 14.5 18.5 C 14.5 18.898 14.342 19.279 14.061 19.561 C 13.779 19.842 13.398 20 13 20 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "WarningCircleWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 12.75 0 C 10.228 0 7.763 0.748 5.666 2.149 C 3.57 3.55 1.936 5.541 0.971 7.871 C 0.006 10.201 -0.247 12.764 0.245 15.237 C 0.737 17.711 1.951 19.982 3.734 21.766 C 5.518 23.549 7.789 24.763 10.263 25.255 C 12.736 25.747 15.299 25.494 17.629 24.529 C 19.959 23.564 21.95 21.93 23.351 19.834 C 24.752 17.737 25.5 15.272 25.5 12.75 C 25.496 9.37 24.151 6.129 21.761 3.739 C 19.371 1.349 16.13 0.004 12.75 0 Z M 12.75 24 C 10.525 24 8.35 23.34 6.5 22.104 C 4.65 20.868 3.208 19.111 2.356 17.055 C 1.505 15 1.282 12.738 1.716 10.555 C 2.15 8.373 3.222 6.368 4.795 4.795 C 6.368 3.222 8.373 2.15 10.555 1.716 C 12.738 1.282 15 1.505 17.055 2.356 C 19.111 3.208 20.868 4.65 22.104 6.5 C 23.34 8.35 24 10.525 24 12.75 C 23.997 15.733 22.81 18.592 20.701 20.701 C 18.592 22.81 15.733 23.997 12.75 24 Z M 12 13.75 L 12 6.75 C 12 6.551 12.079 6.36 12.22 6.22 C 12.36 6.079 12.551 6 12.75 6 C 12.949 6 13.14 6.079 13.28 6.22 C 13.421 6.36 13.5 6.551 13.5 6.75 L 13.5 13.75 C 13.5 13.949 13.421 14.14 13.28 14.28 C 13.14 14.421 12.949 14.5 12.75 14.5 C 12.551 14.5 12.36 14.421 12.22 14.28 C 12.079 14.14 12 13.949 12 13.75 Z M 14 18.25 C 14 18.497 13.927 18.739 13.789 18.944 C 13.652 19.15 13.457 19.31 13.228 19.405 C 13 19.499 12.749 19.524 12.506 19.476 C 12.264 19.428 12.041 19.309 11.866 19.134 C 11.691 18.959 11.572 18.736 11.524 18.494 C 11.476 18.251 11.501 18 11.595 17.772 C 11.69 17.543 11.85 17.348 12.056 17.211 C 12.261 17.073 12.503 17 12.75 17 C 13.082 17 13.399 17.132 13.634 17.366 C 13.868 17.601 14 17.918 14 18.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.250 3.250)\"/>"
    },
    "WarningCircleWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 13 0 C 10.429 0 7.915 0.762 5.778 2.191 C 3.64 3.619 1.974 5.65 0.99 8.025 C 0.006 10.401 -0.252 13.014 0.25 15.536 C 0.751 18.058 1.99 20.374 3.808 22.192 C 5.626 24.01 7.942 25.249 10.464 25.75 C 12.986 26.252 15.599 25.994 17.975 25.01 C 20.35 24.026 22.381 22.36 23.809 20.222 C 25.238 18.085 26 15.571 26 13 C 25.996 9.553 24.626 6.249 22.188 3.812 C 19.751 1.374 16.447 0.004 13 0 Z M 13 24 C 10.824 24 8.698 23.355 6.889 22.146 C 5.08 20.937 3.67 19.22 2.837 17.21 C 2.005 15.2 1.787 12.988 2.211 10.854 C 2.636 8.72 3.683 6.76 5.222 5.222 C 6.76 3.683 8.72 2.636 10.854 2.211 C 12.988 1.787 15.2 2.005 17.21 2.837 C 19.22 3.67 20.937 5.08 22.146 6.889 C 23.355 8.698 24 10.824 24 13 C 23.997 15.916 22.837 18.712 20.775 20.775 C 18.712 22.837 15.916 23.997 13 24 Z M 12 14 L 12 7 C 12 6.735 12.105 6.48 12.293 6.293 C 12.48 6.105 12.735 6 13 6 C 13.265 6 13.52 6.105 13.707 6.293 C 13.895 6.48 14 6.735 14 7 L 14 14 C 14 14.265 13.895 14.52 13.707 14.707 C 13.52 14.895 13.265 15 13 15 C 12.735 15 12.48 14.895 12.293 14.707 C 12.105 14.52 12 14.265 12 14 Z M 14.5 18.5 C 14.5 18.797 14.412 19.087 14.247 19.333 C 14.082 19.58 13.848 19.772 13.574 19.886 C 13.3 19.999 12.998 20.029 12.707 19.971 C 12.416 19.913 12.149 19.77 11.939 19.561 C 11.73 19.351 11.587 19.084 11.529 18.793 C 11.471 18.502 11.501 18.2 11.614 17.926 C 11.728 17.652 11.92 17.418 12.167 17.253 C 12.413 17.088 12.703 17 13 17 C 13.398 17 13.779 17.158 14.061 17.439 C 14.342 17.721 14.5 18.102 14.5 18.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "WarningCircleWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 12.5 0 C 10.028 0 7.611 0.733 5.555 2.107 C 3.5 3.48 1.898 5.432 0.952 7.716 C 0.005 10.001 -0.242 12.514 0.24 14.939 C 0.723 17.363 1.913 19.591 3.661 21.339 C 5.409 23.087 7.637 24.278 10.061 24.76 C 12.486 25.242 14.999 24.995 17.284 24.048 C 19.568 23.102 21.52 21.5 22.893 19.445 C 24.267 17.389 25 14.972 25 12.5 C 24.996 9.186 23.678 6.009 21.335 3.665 C 18.991 1.322 15.814 0.004 12.5 0 Z M 12.5 24 C 10.226 24 8.002 23.326 6.111 22.062 C 4.22 20.798 2.746 19.002 1.875 16.901 C 1.005 14.8 0.777 12.487 1.221 10.256 C 1.665 8.026 2.76 5.977 4.368 4.368 C 5.977 2.76 8.026 1.665 10.256 1.221 C 12.487 0.777 14.8 1.005 16.901 1.875 C 19.002 2.746 20.798 4.22 22.062 6.111 C 23.326 8.002 24 10.226 24 12.5 C 23.997 15.549 22.784 18.472 20.628 20.628 C 18.472 22.784 15.549 23.997 12.5 24 Z M 12 13.5 L 12 6.5 C 12 6.367 12.053 6.24 12.146 6.146 C 12.24 6.053 12.367 6 12.5 6 C 12.633 6 12.76 6.053 12.854 6.146 C 12.947 6.24 13 6.367 13 6.5 L 13 13.5 C 13 13.633 12.947 13.76 12.854 13.854 C 12.76 13.947 12.633 14 12.5 14 C 12.367 14 12.24 13.947 12.146 13.854 C 12.053 13.76 12 13.633 12 13.5 Z M 13.5 18 C 13.5 18.198 13.441 18.391 13.331 18.556 C 13.222 18.72 13.065 18.848 12.883 18.924 C 12.7 19 12.499 19.019 12.305 18.981 C 12.111 18.942 11.933 18.847 11.793 18.707 C 11.653 18.567 11.558 18.389 11.519 18.195 C 11.481 18.001 11.5 17.8 11.576 17.617 C 11.652 17.435 11.78 17.278 11.944 17.169 C 12.109 17.059 12.302 17 12.5 17 C 12.765 17 13.02 17.105 13.207 17.293 C 13.395 17.48 13.5 17.735 13.5 18 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.500 3.500)\"/>"
    },
    "WarningSolid": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.75 0 C 7.822 0 5.937 0.572 4.333 1.643 C 2.73 2.715 1.48 4.237 0.742 6.019 C 0.004 7.8 -0.189 9.761 0.187 11.652 C 0.564 13.543 1.492 15.281 2.856 16.644 C 4.219 18.008 5.957 18.936 7.848 19.313 C 9.739 19.689 11.7 19.496 13.481 18.758 C 15.263 18.02 16.785 16.77 17.857 15.167 C 18.928 13.563 19.5 11.678 19.5 9.75 C 19.497 7.165 18.469 4.687 16.641 2.859 C 14.813 1.031 12.335 0.003 9.75 0 Z M 9 5.25 C 9 5.051 9.079 4.86 9.22 4.72 C 9.36 4.579 9.551 4.5 9.75 4.5 C 9.949 4.5 10.14 4.579 10.28 4.72 C 10.421 4.86 10.5 5.051 10.5 5.25 L 10.5 10.5 C 10.5 10.699 10.421 10.89 10.28 11.03 C 10.14 11.171 9.949 11.25 9.75 11.25 C 9.551 11.25 9.36 11.171 9.22 11.03 C 9.079 10.89 9 10.699 9 10.5 L 9 5.25 Z M 9.75 15 C 9.528 15 9.31 14.934 9.125 14.81 C 8.94 14.687 8.796 14.511 8.711 14.306 C 8.625 14.1 8.603 13.874 8.647 13.656 C 8.69 13.437 8.797 13.237 8.955 13.08 C 9.112 12.922 9.312 12.815 9.531 12.772 C 9.749 12.728 9.975 12.75 10.181 12.836 C 10.386 12.921 10.562 13.065 10.685 13.25 C 10.809 13.435 10.875 13.652 10.875 13.875 C 10.875 14.173 10.756 14.46 10.545 14.67 C 10.335 14.881 10.048 15 9.75 15 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "XWeightBold": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 20.565 18.444 C 20.847 18.726 21.005 19.108 21.005 19.506 C 21.005 19.905 20.847 20.287 20.565 20.569 C 20.283 20.851 19.901 21.009 19.503 21.009 C 19.104 21.009 18.722 20.851 18.44 20.569 L 10.504 12.63 L 2.565 20.566 C 2.283 20.848 1.901 21.006 1.503 21.006 C 1.104 21.006 0.722 20.848 0.44 20.566 C 0.158 20.285 0 19.902 0 19.504 C 0 19.105 0.158 18.723 0.44 18.441 L 8.379 10.505 L 0.443 2.566 C 0.161 2.285 0.003 1.902 0.003 1.504 C 0.003 1.105 0.161 0.723 0.443 0.441 C 0.724 0.16 1.107 0.001 1.505 0.001 C 1.904 0.001 2.286 0.16 2.568 0.441 L 10.504 8.38 L 18.443 0.44 C 18.724 0.158 19.107 0 19.505 0 C 19.904 0 20.286 0.158 20.568 0.44 C 20.849 0.722 21.008 1.104 21.008 1.503 C 21.008 1.901 20.849 2.283 20.568 2.565 L 12.629 10.505 L 20.565 18.444 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.496 5.495)\"/>"
    },
    "XWeightDuotone": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 1 L 22 21 C 22 21.265 21.895 21.52 21.707 21.707 C 21.52 21.895 21.265 22 21 22 L 1 22 C 0.735 22 0.48 21.895 0.293 21.707 C 0.105 21.52 0 21.265 0 21 L 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 21 0 C 21.265 0 21.52 0.105 21.707 0.293 C 21.895 0.48 22 0.735 22 1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 5)\"/><path d=\"M 19.708 18.293 C 19.801 18.386 19.875 18.496 19.925 18.618 C 19.975 18.739 20.001 18.869 20.001 19.001 C 20.001 19.132 19.975 19.262 19.925 19.383 C 19.875 19.505 19.801 19.615 19.708 19.708 C 19.615 19.801 19.505 19.875 19.383 19.925 C 19.262 19.975 19.132 20.001 19.001 20.001 C 18.869 20.001 18.739 19.975 18.618 19.925 C 18.496 19.875 18.386 19.801 18.293 19.708 L 10.001 11.414 L 1.708 19.708 C 1.52 19.896 1.266 20.001 1.001 20.001 C 0.735 20.001 0.481 19.896 0.293 19.708 C 0.105 19.52 0 19.266 0 19.001 C 0 18.735 0.105 18.481 0.293 18.293 L 8.587 10.001 L 0.293 1.708 C 0.105 1.52 0 1.266 0 1.001 C 0 0.735 0.105 0.481 0.293 0.293 C 0.481 0.105 0.735 0 1.001 0 C 1.266 0 1.52 0.105 1.708 0.293 L 10.001 8.587 L 18.293 0.293 C 18.481 0.105 18.735 0 19.001 0 C 19.266 0 19.52 0.105 19.708 0.293 C 19.896 0.481 20.001 0.735 20.001 1.001 C 20.001 1.266 19.896 1.52 19.708 1.708 L 11.414 10.001 L 19.708 18.293 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.999 5.999)\"/>"
    },
    "XWeightFill": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 22 0 L 2 0 C 1.47 0 0.961 0.211 0.586 0.586 C 0.211 0.961 0 1.47 0 2 L 0 22 C 0 22.53 0.211 23.039 0.586 23.414 C 0.961 23.789 1.47 24 2 24 L 22 24 C 22.53 24 23.039 23.789 23.414 23.414 C 23.789 23.039 24 22.53 24 22 L 24 2 C 24 1.47 23.789 0.961 23.414 0.586 C 23.039 0.211 22.53 0 22 0 Z M 18.708 17.292 C 18.8 17.385 18.874 17.496 18.924 17.617 C 18.975 17.738 19.001 17.869 19.001 18 C 19.001 18.131 18.975 18.262 18.924 18.383 C 18.874 18.504 18.8 18.615 18.708 18.708 C 18.615 18.8 18.504 18.874 18.383 18.924 C 18.262 18.975 18.131 19.001 18 19.001 C 17.869 19.001 17.738 18.975 17.617 18.924 C 17.496 18.874 17.385 18.8 17.292 18.708 L 12 13.414 L 6.708 18.708 C 6.52 18.895 6.265 19.001 6 19.001 C 5.735 19.001 5.48 18.895 5.292 18.708 C 5.105 18.52 4.999 18.265 4.999 18 C 4.999 17.735 5.105 17.48 5.292 17.292 L 10.586 12 L 5.292 6.708 C 5.105 6.52 4.999 6.265 4.999 6 C 4.999 5.735 5.105 5.48 5.293 5.293 C 5.48 5.105 5.735 4.999 6 4.999 C 6.265 4.999 6.52 5.105 6.708 5.292 L 12 10.586 L 17.292 5.292 C 17.48 5.105 17.735 4.999 18 4.999 C 18.265 4.999 18.52 5.105 18.708 5.292 C 18.895 5.48 19.001 5.735 19.001 6 C 19.001 6.265 18.895 6.52 18.708 6.708 L 13.414 12 L 18.708 17.292 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
    },
    "XWeightLight": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 19.261 18.201 C 19.335 18.27 19.394 18.353 19.435 18.445 C 19.476 18.537 19.498 18.636 19.5 18.737 C 19.502 18.837 19.483 18.938 19.445 19.031 C 19.408 19.124 19.352 19.209 19.28 19.28 C 19.209 19.352 19.124 19.408 19.031 19.445 C 18.938 19.483 18.837 19.502 18.737 19.5 C 18.636 19.498 18.537 19.476 18.445 19.435 C 18.353 19.394 18.27 19.335 18.201 19.261 L 9.731 10.793 L 1.261 19.261 C 1.119 19.394 0.931 19.466 0.737 19.462 C 0.542 19.459 0.357 19.38 0.22 19.243 C 0.082 19.106 0.004 18.92 0 18.726 C -0.003 18.532 0.069 18.343 0.201 18.201 L 8.67 9.731 L 0.201 1.261 C 0.069 1.119 -0.003 0.931 0 0.737 C 0.004 0.542 0.082 0.357 0.22 0.22 C 0.357 0.082 0.542 0.004 0.737 0 C 0.931 -0.003 1.119 0.069 1.261 0.201 L 9.731 8.67 L 18.201 0.201 C 18.343 0.069 18.532 -0.003 18.726 0 C 18.92 0.004 19.106 0.082 19.243 0.22 C 19.38 0.357 19.459 0.542 19.462 0.737 C 19.466 0.931 19.394 1.119 19.261 1.261 L 10.793 9.731 L 19.261 18.201 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.269 6.269)\"/>"
    },
    "XWeightRegular": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 19.708 18.293 C 19.801 18.386 19.875 18.496 19.925 18.618 C 19.975 18.739 20.001 18.869 20.001 19.001 C 20.001 19.132 19.975 19.262 19.925 19.383 C 19.875 19.505 19.801 19.615 19.708 19.708 C 19.615 19.801 19.505 19.875 19.383 19.925 C 19.262 19.975 19.132 20.001 19.001 20.001 C 18.869 20.001 18.739 19.975 18.618 19.925 C 18.496 19.875 18.386 19.801 18.293 19.708 L 10.001 11.414 L 1.708 19.708 C 1.52 19.896 1.266 20.001 1.001 20.001 C 0.735 20.001 0.481 19.896 0.293 19.708 C 0.105 19.52 0 19.266 0 19.001 C 0 18.735 0.105 18.481 0.293 18.293 L 8.587 10.001 L 0.293 1.708 C 0.105 1.52 0 1.266 0 1.001 C 0 0.735 0.105 0.481 0.293 0.293 C 0.481 0.105 0.735 0 1.001 0 C 1.266 0 1.52 0.105 1.708 0.293 L 10.001 8.587 L 18.293 0.293 C 18.481 0.105 18.735 0 19.001 0 C 19.266 0 19.52 0.105 19.708 0.293 C 19.896 0.481 20.001 0.735 20.001 1.001 C 20.001 1.266 19.896 1.52 19.708 1.708 L 11.414 10.001 L 19.708 18.293 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.999 5.999)\"/>"
    },
    "XWeightThin": {
      viewBox: "0 0 32 32",
      body: "<path d=\"M 18.854 18.147 C 18.948 18.24 19.001 18.368 19.001 18.5 C 19.001 18.633 18.948 18.76 18.854 18.854 C 18.76 18.948 18.633 19.001 18.5 19.001 C 18.368 19.001 18.24 18.948 18.147 18.854 L 9.5 10.208 L 0.854 18.854 C 0.76 18.948 0.633 19.001 0.5 19.001 C 0.368 19.001 0.24 18.948 0.147 18.854 C 0.053 18.76 0 18.633 0 18.5 C 0 18.368 0.053 18.24 0.147 18.147 L 8.793 9.5 L 0.147 0.854 C 0.053 0.76 0 0.633 0 0.5 C 0 0.368 0.053 0.24 0.147 0.147 C 0.24 0.053 0.368 0 0.5 0 C 0.633 0 0.76 0.053 0.854 0.147 L 9.5 8.793 L 18.147 0.147 C 18.193 0.1 18.248 0.063 18.309 0.038 C 18.37 0.013 18.435 0 18.5 0 C 18.566 0 18.631 0.013 18.692 0.038 C 18.752 0.063 18.808 0.1 18.854 0.147 C 18.9 0.193 18.937 0.248 18.962 0.309 C 18.988 0.37 19.001 0.435 19.001 0.5 C 19.001 0.566 18.988 0.631 18.962 0.692 C 18.937 0.752 18.9 0.808 18.854 0.854 L 10.208 9.5 L 18.854 18.147 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.500 6.500)\"/>"
    }
  };
} catch {}
Object.assign(__ds_scope, { __ds_default_components_icons_icon_data_12stud1 });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/icon-data.js", error: String((e && e.message) || e) }); }

__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 = __ds_scope.__ds_default_components_icons_icon_data_12stud1;

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const WEIGHTS = ['Regular', 'Bold', 'Fill', 'Light', 'Thin', 'Duotone'];

/* Bento's icon components are instances of the Phosphor library, so the extracted
   names carry a Weight suffix ("BellWeightRegular"). resolve() lets callers use the
   plain glyph name and an optional weight, and still hit the exact data key. */
function resolveIconName(name, weight) {
  if (__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1[name]) return name;
  if (weight) {
    const w = weight[0].toUpperCase() + weight.slice(1).toLowerCase();
    if (__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1[name + 'Weight' + w]) return name + 'Weight' + w;
  }
  for (const w of WEIGHTS) if (__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1[name + 'Weight' + w]) return name + 'Weight' + w;
  return null;
}
function Icon({
  name,
  size = 24,
  weight,
  style,
  ...rest
}) {
  const key = resolveIconName(name, weight);
  if (!key) return null;
  const d = __ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1[key];
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: d.viewBox,
    fill: "none",
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    }
    // body strings are emitter-controlled <path> markup — geometry,
    // numeric fills and transforms only; no .fig-authored text reaches them.
    ,
    dangerouslySetInnerHTML: {
      __html: d.body
    }
  }, rest));
}
Object.assign(__ds_scope, { resolveIconName, Icon, __ds_default_components_icons_Icon_fio49a: Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZE = {
  large: {
    padding: '16px 24px',
    font: 'var(--bento-weight-medium) 14px/18px var(--bento-font-ui)',
    icon: 24
  },
  medium: {
    padding: '12px 16px',
    font: 'var(--bento-weight-medium) 14px/18px var(--bento-font-ui)',
    icon: 24
  },
  small: {
    padding: '8px 16px',
    font: 'var(--bento-weight-medium) 14px/18px var(--bento-font-ui)',
    icon: 24
  }
};
const SKIN = {
  solid: {
    primary: {
      bg: 'var(--bento-action-solid-primary-bg)',
      fg: 'var(--bento-action-solid-primary-fg)',
      bgHover: 'var(--bento-action-solid-primary-bg-hover)',
      fgHover: 'var(--bento-action-solid-primary-fg-hover)'
    },
    secondary: {
      bg: 'var(--bento-action-solid-secondary-bg)',
      fg: 'var(--bento-action-solid-secondary-fg)',
      bgHover: 'var(--bento-action-solid-secondary-bg-hover)',
      fgHover: 'var(--bento-action-solid-secondary-fg-hover)'
    },
    danger: {
      bg: 'var(--bento-action-solid-danger-bg)',
      fg: 'var(--bento-action-solid-danger-fg)',
      bgHover: 'var(--bento-action-solid-danger-bg-hover)',
      fgHover: 'var(--bento-action-solid-danger-fg-hover)'
    }
  },
  outline: {
    primary: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-primary-fg)',
      line: 'var(--bento-action-outline-primary-outline)',
      bgHover: 'var(--bento-action-transparent-primary-bg-hover)',
      fgHover: 'var(--bento-action-transparent-primary-fg-hover)',
      lineHover: 'var(--bento-action-outline-primary-outline-hover)'
    },
    secondary: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-secondary-fg)',
      line: 'var(--bento-action-outline-secondary-outline)',
      bgHover: 'var(--bento-action-transparent-secondary-bg-hover)',
      fgHover: 'var(--bento-action-transparent-secondary-fg-hover)',
      lineHover: 'var(--bento-action-outline-secondary-outline-hover)'
    },
    danger: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-danger-fg)',
      line: 'var(--bento-action-outline-danger-outline)',
      bgHover: 'var(--bento-action-transparent-danger-bg-hover)',
      fgHover: 'var(--bento-action-transparent-danger-fg-hover)',
      lineHover: 'var(--bento-action-outline-danger-outline-hover)'
    }
  },
  transparent: {
    primary: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-primary-fg)',
      bgHover: 'var(--bento-action-transparent-primary-bg-hover)',
      fgHover: 'var(--bento-action-transparent-primary-fg-hover)'
    },
    secondary: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-secondary-fg)',
      bgHover: 'var(--bento-action-transparent-secondary-bg-hover)',
      fgHover: 'var(--bento-action-transparent-secondary-fg-hover)'
    },
    danger: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-danger-fg)',
      bgHover: 'var(--bento-action-transparent-danger-bg-hover)',
      fgHover: 'var(--bento-action-transparent-danger-fg-hover)'
    }
  }
};
function Button({
  label = 'Button',
  kind = 'solid',
  hierarchy = 'primary',
  size = 'medium',
  state = 'enabled',
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = SIZE[size] || SIZE.medium;
  const skin = (SKIN[kind] || SKIN.solid)[hierarchy] || SKIN.solid.primary;
  const disabled = state === 'disabled';
  const active = !disabled && (hover || state === 'hover' || state === 'focus');
  let bg = active ? skin.bgHover : skin.bg;
  let fg = active ? skin.fgHover : skin.fg;
  let line = kind === 'outline' ? active ? skin.lineHover : skin.line : null;
  if (disabled) {
    bg = kind === 'solid' ? 'var(--bento-action-disabled-bg)' : 'transparent';
    fg = 'var(--bento-action-disabled-fg)';
    line = kind === 'outline' ? 'var(--bento-action-disabled-bg)' : null;
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: s.padding,
      borderRadius: 'var(--bento-radius-16)',
      border: 'none',
      width: fullWidth ? '100%' : 'fit-content',
      background: bg,
      color: fg,
      font: s.font,
      boxShadow: line ? `inset 0 0 0 var(--bento-border-width-strong) ${line}` : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 120ms ease, color 120ms ease, box-shadow 120ms ease',
      ...style
    }
  }, rest), leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: s.icon
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, label), trailingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { Button, __ds_default_components_actions_Button_8qpwqe: Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/Actions.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Actions({
  primaryLabel = 'Action',
  secondaryLabel = 'Cancel',
  size = 'medium',
  hierarchy = 'primary',
  align = 'flex-end',
  onPrimary,
  onSecondary,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      justifyContent: align,
      alignItems: 'center',
      ...style
    }
  }, rest), secondaryLabel && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    label: secondaryLabel,
    kind: "transparent",
    hierarchy: "secondary",
    size: size,
    onClick: onSecondary
  }), primaryLabel && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    label: primaryLabel,
    kind: "solid",
    hierarchy: hierarchy,
    size: size,
    onClick: onPrimary
  }));
}
Object.assign(__ds_scope, { Actions, __ds_default_components_actions_Actions_16dv757: Actions });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Actions.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZE = {
  12: 28,
  16: 32,
  24: 40
};
const SKIN = {
  solid: {
    primary: {
      bg: 'var(--bento-action-solid-primary-bg)',
      fg: 'var(--bento-action-solid-primary-fg)',
      bgHover: 'var(--bento-action-solid-primary-bg-hover)'
    },
    secondary: {
      bg: 'var(--bento-action-solid-secondary-bg)',
      fg: 'var(--bento-action-solid-secondary-fg)',
      bgHover: 'var(--bento-action-solid-secondary-bg-hover)'
    },
    danger: {
      bg: 'var(--bento-action-solid-danger-bg)',
      fg: 'var(--bento-action-solid-danger-fg)',
      bgHover: 'var(--bento-action-solid-danger-bg-hover)'
    }
  },
  outline: {
    primary: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-primary-fg)',
      line: 'var(--bento-action-outline-primary-outline)',
      bgHover: 'var(--bento-action-transparent-primary-bg-hover)',
      lineHover: 'var(--bento-action-outline-primary-outline-hover)'
    },
    secondary: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-secondary-fg)',
      line: 'var(--bento-action-outline-secondary-outline)',
      bgHover: 'var(--bento-action-transparent-secondary-bg-hover)',
      lineHover: 'var(--bento-action-outline-secondary-outline-hover)'
    },
    danger: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-danger-fg)',
      line: 'var(--bento-action-outline-danger-outline)',
      bgHover: 'var(--bento-action-transparent-danger-bg-hover)',
      lineHover: 'var(--bento-action-outline-danger-outline-hover)'
    }
  },
  transparent: {
    primary: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-primary-fg)',
      bgHover: 'var(--bento-action-transparent-primary-bg-hover)'
    },
    secondary: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-secondary-fg)',
      bgHover: 'var(--bento-action-transparent-secondary-bg-hover)'
    },
    danger: {
      bg: 'transparent',
      fg: 'var(--bento-action-transparent-danger-fg)',
      bgHover: 'var(--bento-action-transparent-danger-bg-hover)'
    }
  }
};
function IconButton({
  icon = 'DotsHorizontal',
  kind = 'transparent',
  hierarchy = 'secondary',
  size = 24,
  state = 'enabled',
  label,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const box = SIZE[size] || size + 16;
  const skin = (SKIN[kind] || SKIN.transparent)[hierarchy] || SKIN.transparent.secondary;
  const disabled = state === 'disabled';
  const active = !disabled && (hover || state === 'hover' || state === 'focus');
  let bg = active ? skin.bgHover : skin.bg;
  let fg = skin.fg;
  let line = kind === 'outline' ? active ? skin.lineHover : skin.line : null;
  if (disabled) {
    bg = kind === 'solid' ? 'var(--bento-action-disabled-bg)' : 'transparent';
    fg = 'var(--bento-action-disabled-fg)';
    line = kind === 'outline' ? 'var(--bento-action-disabled-bg)' : null;
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label || icon,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: box,
      height: box,
      flexShrink: 0,
      borderRadius: 'var(--bento-radius-full)',
      border: 'none',
      background: bg,
      color: fg,
      boxShadow: line ? `inset 0 0 0 var(--bento-border-width-strong) ${line}` : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 120ms ease, box-shadow 120ms ease',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size
  }));
}
Object.assign(__ds_scope, { IconButton, __ds_default_components_actions_IconButton_1gqf9dr: IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/actions/Link.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FONT = {
  large: 'var(--bento-weight-regular) 16px/24px var(--bento-font-ui)',
  medium: 'var(--bento-weight-regular) 14px/20px var(--bento-font-ui)',
  small: 'var(--bento-weight-regular) 12px/18px var(--bento-font-ui)'
};
function Link({
  label = 'Link',
  href = '#',
  size = 'medium',
  state = 'enabled',
  inverse = false,
  leadingIcon,
  trailingIcon,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const disabled = state === 'disabled';
  const active = !disabled && (hover || state === 'hover' || state === 'focus');
  const color = disabled ? inverse ? 'var(--bento-interactive-disabled-inverse)' : 'var(--bento-interactive-disabled)' : inverse ? active ? 'var(--bento-interactive-hover-inverse)' : 'var(--bento-interactive-enabled-inverse)' : active ? 'var(--bento-interactive-hover)' : 'var(--bento-interactive-enabled)';
  return /*#__PURE__*/React.createElement("a", _extends({
    href: disabled ? undefined : href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      font: FONT[size] || FONT.medium,
      color,
      textDecoration: 'underline',
      textUnderlineOffset: 2,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, rest), leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: 16
  }), label, trailingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: 16
  }));
}
Object.assign(__ds_scope, { Link, __ds_default_components_actions_Link_1lxmtbc: Link });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Link.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COLORS = ['indigo', 'violet', 'pink', 'red', 'orange', 'yellow', 'green', 'jade', 'blue', 'grey'];
function Avatar({
  kind = 'initials',
  initials = 'ES',
  src,
  alt = '',
  color = 'indigo',
  size = 48,
  style,
  ...rest
}) {
  const bg = COLORS.includes(color) ? `var(--bento-decorative-soft-${color})` : color;
  const base = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: 'var(--bento-radius-full)',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: bg,
    ...style
  };
  if (kind === 'image' && src) {
    return /*#__PURE__*/React.createElement("img", _extends({
      src: src,
      alt: alt,
      style: {
        ...base,
        objectFit: 'cover'
      }
    }, rest));
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: base
  }, rest), kind === 'icon' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "UserWeightFill",
    size: Math.round(size / 2),
    style: {
      color: 'var(--bento-icon-primary)'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--bento-weight-medium) ${Math.round(size / 4)}px/1 var(--bento-font-ui)`,
      color: 'var(--bento-content-primary)'
    }
  }, initials));
}
Object.assign(__ds_scope, { Avatar, __ds_default_components_display_Avatar_1dmo83i: Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COLORS = ['indigo', 'violet', 'pink', 'red', 'orange', 'yellow', 'green', 'jade', 'blue', 'grey'];
function Chip({
  label = 'Chip',
  color = 'indigo',
  leadingIcon,
  removable = false,
  state = 'enabled',
  onRemove,
  style,
  ...rest
}) {
  const disabled = state === 'disabled';
  const bg = COLORS.includes(color) ? `var(--bento-decorative-soft-${color})` : color;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      width: 'fit-content',
      padding: '4px 12px',
      boxSizing: 'border-box',
      borderRadius: 13,
      background: disabled ? 'var(--bento-bg-secondary)' : bg,
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, rest), leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: 12,
    style: {
      color: 'var(--bento-icon-primary)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-medium) 11px/14px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)',
      whiteSpace: 'nowrap'
    }
  }, label), removable && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "XWeightBold",
    size: 12,
    label: 'Remove ' + label,
    onClick: onRemove,
    style: {
      width: 16,
      height: 16
    }
  }));
}
Object.assign(__ds_scope, { Chip, __ds_default_components_display_Chip_4cnfr7: Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Chip.jsx", error: String((e && e.message) || e) }); }

// components/display/List.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ListItem({
  firstLine = 'Item',
  secondLine,
  leadingIcon,
  trailingIcon,
  selected = false,
  state = 'enabled',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const disabled = state === 'disabled';
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "option",
    "aria-selected": selected,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      padding: '8px 12px',
      boxSizing: 'border-box',
      borderRadius: 'var(--bento-radius-16)',
      background: selected ? 'var(--bento-bg-interactive-overlay)' : hover && !disabled ? 'var(--bento-bg-overlay)' : 'transparent',
      cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
      ...style
    }
  }, rest), leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: 24,
    style: {
      color: 'var(--bento-icon-secondary)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
      color: disabled ? 'var(--bento-content-disabled)' : 'var(--bento-content-primary)'
    }
  }, firstLine), secondLine && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 12px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, secondLine)), trailingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: 24,
    style: {
      color: 'var(--bento-icon-secondary)'
    }
  }));
}
function List({
  items = [],
  width = 240,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "listbox",
    style: {
      display: 'flex',
      flexDirection: 'column',
      width,
      ...style
    }
  }, rest), items.map((it, i) => /*#__PURE__*/React.createElement(ListItem, _extends({
    key: i
  }, it))));
}
Object.assign(__ds_scope, { ListItem, List, __ds_default_components_display_List_4cueez: List });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/List.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Banner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONE = {
  informative: {
    bg: 'var(--bento-bg-informative)',
    fg: 'var(--bento-content-informative)',
    icon: 'var(--bento-icon-informative)',
    line: 'var(--bento-border-informative)',
    glyph: 'InfoSolid'
  },
  positive: {
    bg: 'var(--bento-bg-positive)',
    fg: 'var(--bento-content-positive)',
    icon: 'var(--bento-icon-positive)',
    line: 'var(--bento-border-positive)',
    glyph: 'PositiveSolid'
  },
  warning: {
    bg: 'var(--bento-bg-warning)',
    fg: 'var(--bento-content-warning)',
    icon: 'var(--bento-icon-warning)',
    line: 'var(--bento-border-warning)',
    glyph: 'WarningSolid'
  },
  negative: {
    bg: 'var(--bento-bg-negative)',
    fg: 'var(--bento-content-negative)',
    icon: 'var(--bento-icon-negative)',
    line: 'var(--bento-border-negative)',
    glyph: 'NegativeSolid'
  }
};
function Banner({
  tone = 'informative',
  title,
  text = 'Something worth knowing about this page.',
  showIcon = true,
  dismissible = true,
  primaryLabel,
  secondaryLabel,
  width = 320,
  onDismiss,
  style,
  ...rest
}) {
  const t = TONE[tone] || TONE.informative;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'flex-start',
      width,
      padding: 16,
      boxSizing: 'border-box',
      borderRadius: 'var(--bento-radius-16)',
      background: t.bg,
      boxShadow: `inset 0 0 0 var(--bento-border-width) ${t.line}`,
      ...style
    }
  }, rest), showIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.glyph,
    size: 16,
    style: {
      color: t.icon,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-semibold) 14px/18px var(--bento-font-ui)',
      color: t.fg
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)'
    }
  }, text), (primaryLabel || secondaryLabel) && /*#__PURE__*/React.createElement(__ds_scope.Actions, {
    primaryLabel: primaryLabel,
    secondaryLabel: secondaryLabel,
    size: "small",
    align: "flex-start"
  })), dismissible && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "XWeightBold",
    size: 16,
    label: "Dismiss",
    onClick: onDismiss
  }));
}
Object.assign(__ds_scope, { Banner, __ds_default_components_feedback_Banner_2q95tw: Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Banner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Disclosure.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Disclosure({
  label = 'Label',
  children,
  level = 'first',
  iconPosition = 'trailing',
  divider = false,
  open,
  defaultOpen = false,
  onToggle,
  style,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = open === undefined ? internal : open;
  const nested = level === 'second';
  const toggle = () => {
    const next = !isOpen;
    if (open === undefined) setInternal(next);
    if (onToggle) onToggle(next);
  };
  const chevron = /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: isOpen ? 'ChevronUp' : 'ChevronDown',
    size: 24,
    style: {
      color: 'var(--bento-icon-primary)',
      flexShrink: 0
    }
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      alignSelf: 'stretch',
      borderBottom: divider ? '1px solid var(--bento-border-container)' : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: toggle,
    "aria-expanded": isOpen,
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      width: '100%',
      padding: nested ? '12px 16px 12px 40px' : '12px 16px',
      boxSizing: 'border-box',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      textAlign: 'left',
      font: `var(--bento-weight-${nested ? 'regular' : 'medium'}) 14px/18px var(--bento-font-component)`,
      letterSpacing: '0.020em',
      color: 'var(--bento-content-primary)'
    }
  }, iconPosition === 'leading' && chevron, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), iconPosition === 'trailing' && chevron), isOpen && children != null && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: nested ? '0 16px 12px 40px' : '0 16px 12px',
      font: 'var(--bento-body-md)',
      color: 'var(--bento-content-secondary)'
    }
  }, children));
}
Object.assign(__ds_scope, { Disclosure, __ds_default_components_feedback_Disclosure_1pygxgr: Disclosure });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Disclosure.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Feedback.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Feedback({
  title = 'Nothing here yet',
  text = 'When something arrives, it will show up in this space.',
  size = 'medium',
  icon,
  primaryLabel,
  secondaryLabel,
  width = 440,
  style,
  ...rest
}) {
  const big = size === 'large';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      alignItems: 'center',
      width,
      padding: 16,
      boxSizing: 'border-box',
      borderRadius: 36,
      textAlign: 'center',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24,
    style: {
      color: 'var(--bento-icon-secondary)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: big ? 'var(--bento-weight-semibold) 36px/46px var(--bento-font-ui)' : 'var(--bento-weight-semibold) 22px/24px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, text)), (primaryLabel || secondaryLabel) && /*#__PURE__*/React.createElement(__ds_scope.Actions, {
    primaryLabel: primaryLabel,
    secondaryLabel: secondaryLabel,
    size: "medium",
    align: "center"
  }));
}
Object.assign(__ds_scope, { Feedback, __ds_default_components_feedback_Feedback_1aedwlv: Feedback });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Feedback.jsx", error: String((e && e.message) || e) }); }

// components/feedback/InlineLoader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function InlineLoader({
  text = 'Loading',
  size = 16,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      width: 'fit-content',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "SpinnerWeightRegular",
    size: size,
    style: {
      color: 'var(--bento-icon-secondary)',
      animation: 'bento-spin 900ms linear infinite'
    }
  }), text && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 12px/16px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, text), /*#__PURE__*/React.createElement("style", null, '@keyframes bento-spin{to{transform:rotate(360deg)}}'));
}
Object.assign(__ds_scope, { InlineLoader, __ds_default_components_feedback_InlineLoader_13e6db8: InlineLoader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/InlineLoader.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const WIDTH = {
  small: 400,
  medium: 560,
  large: 720
};
function Modal({
  title = 'Title',
  children,
  size = 'small',
  kind = 'normal',
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
  open = true,
  style,
  ...rest
}) {
  if (!open) return null;
  const danger = kind === 'danger';
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    style: {
      width: WIDTH[size] || WIDTH.small,
      borderRadius: 24,
      overflow: 'hidden',
      background: 'var(--bento-bg-primary)',
      boxShadow: 'inset 0 0 0 1px var(--bento-neutral-5), var(--bento-elevation-lg)',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 72,
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      padding: '0 24px',
      boxSizing: 'border-box',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--bento-title-md)',
      color: danger ? 'var(--bento-content-negative)' : 'var(--bento-content-primary)'
    }
  }, title), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "XWeightBold",
    kind: "transparent",
    size: 16,
    label: "Close",
    onClick: onClose
  })), /*#__PURE__*/React.createElement(__ds_scope.Divider, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px',
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-component)',
      color: 'var(--bento-content-primary)'
    }
  }, children), (primaryLabel || secondaryLabel) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0 24px 24px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Actions, {
    primaryLabel: primaryLabel,
    secondaryLabel: secondaryLabel,
    hierarchy: danger ? 'danger' : 'primary',
    onPrimary: onPrimary,
    onSecondary: onSecondary
  })));
}
Object.assign(__ds_scope, { Modal, __ds_default_components_feedback_Modal_sadu4b: Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONE = {
  informative: {
    bg: 'var(--bento-bg-informative)',
    fg: 'var(--bento-content-informative)',
    icon: 'var(--bento-icon-informative)',
    line: 'var(--bento-border-informative)',
    glyph: 'InfoSolid'
  },
  positive: {
    bg: 'var(--bento-bg-positive)',
    fg: 'var(--bento-content-positive)',
    icon: 'var(--bento-icon-positive)',
    line: 'var(--bento-border-positive)',
    glyph: 'PositiveSolid'
  },
  warning: {
    bg: 'var(--bento-bg-warning)',
    fg: 'var(--bento-content-warning)',
    icon: 'var(--bento-icon-warning)',
    line: 'var(--bento-border-warning)',
    glyph: 'WarningSolid'
  },
  negative: {
    bg: 'var(--bento-bg-negative)',
    fg: 'var(--bento-content-negative)',
    icon: 'var(--bento-icon-negative)',
    line: 'var(--bento-border-negative)',
    glyph: 'NegativeSolid'
  }
};
function Toast({
  tone = 'informative',
  text = 'Changes saved.',
  showIcon = true,
  dismissible = true,
  width = 320,
  onDismiss,
  style,
  ...rest
}) {
  const t = TONE[tone] || TONE.informative;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      width,
      padding: '12px 24px',
      boxSizing: 'border-box',
      borderRadius: 'var(--bento-radius-16)',
      background: t.bg,
      boxShadow: 'var(--bento-elevation-lg)',
      ...style
    }
  }, rest), showIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.glyph,
    size: 16,
    style: {
      color: t.icon
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: '10px 0',
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
      color: t.fg
    }
  }, text), dismissible && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "XWeightBold",
    size: 16,
    label: "Dismiss",
    onClick: onDismiss
  }));
}
Object.assign(__ds_scope, { Toast, __ds_default_components_feedback_Toast_sfbpi1: Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked = false,
  mixed = false,
  state = 'enabled',
  onChange,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const disabled = state === 'disabled';
  const error = state === 'error';
  const on = checked || mixed;
  const line = error ? 'var(--bento-border-negative)' : disabled ? 'var(--bento-border-input-disabled)' : hover || state === 'hover' || state === 'focus' ? 'var(--bento-border-input-hover)' : 'var(--bento-border-input-enabled)';
  return /*#__PURE__*/React.createElement("label", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      width: 'fit-content',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 24,
      height: 24,
      borderRadius: 'var(--bento-radius-8)',
      background: on ? disabled ? 'var(--bento-action-disabled-bg)' : 'var(--bento-bg-interactive)' : disabled ? 'var(--bento-bg-secondary)' : 'var(--bento-bg-primary)',
      boxShadow: on ? 'none' : `inset 0 0 0 var(--bento-border-width) ${line}`,
      color: 'var(--bento-white)',
      transition: 'background-color 120ms ease'
    }
  }, mixed ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "MinusWeightBold",
    size: 16
  }) : checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "CheckWeightBold",
    size: 16
  }) : null), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
      color: disabled ? 'var(--bento-content-disabled)' : 'var(--bento-content-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox, __ds_default_components_forms_Checkbox_i1jt6f: Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/display/Table.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Header({
  label,
  sortable,
  sorted,
  align = 'left',
  onSort
}) {
  return /*#__PURE__*/React.createElement("th", {
    style: {
      padding: 0,
      textAlign: align,
      borderBottom: '1px solid var(--bento-neutral-5)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: sortable ? onSort : undefined,
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      width: '100%',
      padding: '8px 16px',
      border: 'none',
      background: 'transparent',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      font: 'var(--bento-weight-medium) 14px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)',
      cursor: sortable ? 'pointer' : 'default'
    }
  }, label, sortable && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: sorted === 'desc' ? 'ChevronDown' : 'ChevronUp',
    size: 12,
    style: {
      color: sorted ? 'var(--bento-icon-interactive)' : 'var(--bento-icon-secondary)'
    }
  })));
}
function Table({
  columns = [],
  rows = [],
  selectable = false,
  selectedRows = [],
  onToggleRow,
  onSort,
  sortBy,
  sortDir = 'asc',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("table", _extends({
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'var(--bento-bg-primary)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, selectable && /*#__PURE__*/React.createElement("th", {
    style: {
      width: 48,
      padding: '8px 16px',
      borderBottom: '1px solid var(--bento-neutral-5)'
    }
  }), columns.map(c => /*#__PURE__*/React.createElement(Header, {
    key: c.key,
    label: c.label,
    sortable: c.sortable,
    align: c.align,
    sorted: sortBy === c.key ? sortDir : null,
    onSort: () => onSort && onSort(c.key)
  })))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      background: selectedRows.includes(i) ? 'var(--bento-bg-interactive-overlay)' : 'transparent'
    }
  }, selectable && /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 16px',
      borderBottom: '1px solid var(--bento-neutral-5)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: selectedRows.includes(i),
    onChange: () => onToggleRow && onToggleRow(i)
  })), columns.map(c => {
    const v = r[c.key];
    return /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        padding: '16px',
        borderBottom: '1px solid var(--bento-neutral-5)',
        textAlign: c.align || 'left',
        font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
        color: 'var(--bento-content-primary)'
      }
    }, c.kind === 'chip' ? /*#__PURE__*/React.createElement(__ds_scope.Chip, {
      label: v,
      color: c.chipColor || 'grey'
    }) : v);
  })))));
}
Object.assign(__ds_scope, { Table, __ds_default_components_display_Table_1v3w13: Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Table.jsx", error: String((e && e.message) || e) }); }

// components/forms/Datepicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function Day({
  label,
  state = 'enabled',
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const selected = state === 'selected';
  const today = state === 'today';
  const disabled = state === 'disabled' || state === 'outside';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 44,
      height: 44,
      padding: 10,
      boxSizing: 'border-box',
      border: 'none',
      borderRadius: 'var(--bento-radius-16)',
      background: selected ? 'var(--bento-bg-interactive)' : hover && !disabled ? 'var(--bento-bg-interactive-overlay)' : 'transparent',
      boxShadow: today && !selected ? 'inset 0 0 0 var(--bento-border-width) var(--bento-border-interactive)' : 'none',
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
      color: selected ? 'var(--bento-white)' : state === 'outside' ? 'var(--bento-content-disabled)' : disabled ? 'var(--bento-content-disabled)' : 'var(--bento-content-primary)',
      cursor: disabled ? 'default' : 'pointer'
    }
  }, label);
}
function Datepicker({
  month = 8,
  year = 2026,
  selectedDay = 16,
  onSelect,
  style,
  ...rest
}) {
  const first = new Date(year, month, 1).getDay();
  const lead = (first + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({
    length: days
  }, (_, i) => i + 1)];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: 'fit-content',
      padding: 16,
      boxSizing: 'border-box',
      borderRadius: 'var(--bento-radius-24)',
      background: 'var(--bento-bg-primary)',
      boxShadow: 'inset 0 0 0 var(--bento-border-width) var(--bento-neutral-5), var(--bento-elevation-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "ChevronLeft",
    size: 16,
    label: "Previous month"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-title-sm)',
      color: 'var(--bento-content-primary)'
    }
  }, MONTHS[month], " ", year), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "ChevronRight",
    size: 16,
    label: "Next month"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 44px)'
    }
  }, DAY_NAMES.map(d => /*#__PURE__*/React.createElement("span", {
    key: d,
    style: {
      height: 44,
      display: 'grid',
      placeItems: 'center',
      font: 'var(--bento-weight-medium) 12px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, d)), cells.map((d, i) => d === null ? /*#__PURE__*/React.createElement("span", {
    key: 'e' + i,
    style: {
      width: 44,
      height: 44
    }
  }) : /*#__PURE__*/React.createElement(Day, {
    key: d,
    label: d,
    state: d === selectedDay ? 'selected' : 'enabled',
    onClick: () => onSelect && onSelect(d)
  }))));
}
Object.assign(__ds_scope, { Datepicker, __ds_default_components_forms_Datepicker_1va2p8s: Datepicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Datepicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BORDER = {
  enabled: 'var(--bento-border-input-enabled)',
  hover: 'var(--bento-border-input-hover)',
  focus: 'var(--bento-border-input-focus)',
  error: 'var(--bento-border-negative)',
  disabled: 'var(--bento-border-input-disabled)',
  readOnly: 'transparent'
};
function Field({
  label = 'Label',
  placeholder = 'Placeholder',
  value,
  kind = 'text',
  state = 'enabled',
  assistiveText,
  errorText,
  required = false,
  leadingIcon,
  trailingIcon,
  unit,
  tip,
  width = 320,
  onChange,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const disabled = state === 'disabled';
  const readOnly = state === 'readOnly';
  const error = state === 'error' || !!errorText;
  const line = error ? BORDER.error : disabled ? BORDER.disabled : readOnly ? BORDER.readOnly : focus || state === 'focus' ? BORDER.focus : hover || state === 'hover' ? BORDER.hover : BORDER.enabled;
  const inputType = kind === 'password' ? 'password' : kind === 'number' || kind === 'currency' || kind === 'percentage' ? 'number' : kind === 'date' ? 'date' : kind === 'time' ? 'time' : 'text';
  const prefix = kind === 'currency' ? '$' : null;
  const suffix = kind === 'percentage' ? '%' : unit;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      alignItems: 'flex-start',
      width,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      font: 'var(--bento-weight-medium) 11px/14px var(--bento-font-ui)',
      color: disabled ? 'var(--bento-content-disabled)' : 'var(--bento-content-secondary)'
    }
  }, label, required && ' *'), tip && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "QuestionCircle",
    size: 16,
    style: {
      color: 'var(--bento-icon-secondary)'
    },
    title: tip
  })), /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: kind === 'textarea' ? 'flex-start' : 'center',
      alignSelf: 'stretch',
      padding: '12px 16px',
      borderRadius: 'var(--bento-radius-16)',
      background: readOnly ? 'transparent' : disabled ? 'var(--bento-bg-secondary)' : 'var(--bento-bg-primary)',
      boxShadow: `inset 0 0 0 ${focus || state === 'focus' || error ? 'var(--bento-border-width-strong)' : 'var(--bento-border-width)'} ${line}`,
      boxSizing: 'border-box'
    }
  }, leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: 24,
    style: {
      color: 'var(--bento-icon-secondary)'
    }
  }), prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 16px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, prefix), kind === 'textarea' ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: 4,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    readOnly: readOnly,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      resize: 'vertical',
      font: 'var(--bento-weight-regular) 16px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)'
    }
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    type: inputType,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    readOnly: readOnly,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--bento-weight-regular) 16px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)'
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 16px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, suffix), trailingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: 24,
    style: {
      color: 'var(--bento-icon-secondary)'
    }
  })), (errorText || assistiveText) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '0 16px',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 12px/16px var(--bento-font-ui)',
      color: errorText ? 'var(--bento-content-negative)' : 'var(--bento-content-secondary)'
    }
  }, errorText || assistiveText)));
}
Object.assign(__ds_scope, { Field, __ds_default_components_forms_Field_jq849g: Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/FieldTip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FieldTip({
  text = 'More information',
  size = 16,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "QuestionCircle",
    size: size,
    style: {
      color: 'var(--bento-icon-secondary)',
      cursor: 'help'
    }
  }), open && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%, -8px)',
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Tooltip, {
    text: text
  })));
}
Object.assign(__ds_scope, { FieldTip, __ds_default_components_forms_FieldTip_n519pd: FieldTip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FieldTip.jsx", error: String((e && e.message) || e) }); }

// components/forms/FileUploader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FileUploader({
  label = 'Label',
  prompt = 'Drag and drop your file here',
  buttonLabel = 'Browse',
  assistiveText = 'Max file size 10 MB',
  state = 'enabled',
  fileName,
  width = 320,
  style,
  ...rest
}) {
  const disabled = state === 'disabled';
  const error = state === 'error';
  const dragging = state === 'draggingOnInput';
  const line = error ? 'var(--bento-border-negative)' : disabled ? 'var(--bento-border-input-disabled)' : dragging ? 'var(--bento-border-input-focus)' : 'var(--bento-border-input-enabled)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      alignItems: 'flex-start',
      width,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("label", {
    style: {
      font: 'var(--bento-weight-medium) 12px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
      height: 128,
      padding: 16,
      boxSizing: 'border-box',
      borderRadius: 'var(--bento-radius-16)',
      background: dragging ? 'var(--bento-bg-interactive-overlay)' : 'transparent',
      boxShadow: `inset 0 0 0 var(--bento-border-width) ${line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)'
    }
  }, fileName || prompt), !fileName && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 12px/18px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, "or")), !fileName && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    label: buttonLabel,
    kind: "outline",
    hierarchy: "primary",
    size: "small",
    state: disabled ? 'disabled' : 'enabled'
  })), assistiveText && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 12px/18px var(--bento-font-ui)',
      color: error ? 'var(--bento-content-negative)' : 'var(--bento-content-secondary)'
    }
  }, assistiveText)));
}
Object.assign(__ds_scope, { FileUploader, __ds_default_components_forms_FileUploader_d5teb0: FileUploader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FileUploader.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SearchBar({
  placeholder = 'Search',
  value = '',
  state = 'enabled',
  width = 320,
  onChange,
  onClear,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const disabled = state === 'disabled';
  const line = disabled ? 'var(--bento-border-input-disabled)' : focus || state === 'focus' ? 'var(--bento-border-input-focus)' : hover || state === 'hover' ? 'var(--bento-border-input-hover)' : 'var(--bento-border-input-enabled)';
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      width,
      padding: '12px 16px',
      boxSizing: 'border-box',
      borderRadius: 'var(--bento-radius-16)',
      background: disabled ? 'var(--bento-bg-secondary)' : 'var(--bento-bg-primary)',
      boxShadow: `inset 0 0 0 ${focus ? 'var(--bento-border-width-strong)' : 'var(--bento-border-width)'} ${line}`,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "Search",
    size: 24,
    style: {
      color: 'var(--bento-icon-secondary)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--bento-weight-regular) 16px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-primary)'
    }
  }), value && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClear,
    "aria-label": "Clear search",
    style: {
      display: 'inline-flex',
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      color: 'var(--bento-icon-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "XWeightBold",
    size: 16
  })));
}
Object.assign(__ds_scope, { SearchBar, __ds_default_components_forms_SearchBar_1moa4qj: SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/SelectField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SelectField({
  label = 'Label',
  placeholder = 'Select an option',
  options = [],
  value,
  state = 'enabled',
  assistiveText,
  errorText,
  width = 320,
  onChange,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const disabled = state === 'disabled';
  const error = state === 'error' || !!errorText;
  const selected = options.find(o => (typeof o === 'string' ? o : o.value) === value);
  const selectedLabel = selected ? typeof selected === 'string' ? selected : selected.label : null;
  const line = error ? 'var(--bento-border-negative)' : disabled ? 'var(--bento-border-input-disabled)' : open ? 'var(--bento-border-input-focus)' : hover ? 'var(--bento-border-input-hover)' : 'var(--bento-border-input-enabled)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      alignItems: 'flex-start',
      width,
      position: 'relative',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("label", {
    style: {
      font: 'var(--bento-weight-medium) 11px/14px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      alignSelf: 'stretch',
      padding: '12px 16px',
      borderRadius: 'var(--bento-radius-16)',
      border: 'none',
      textAlign: 'left',
      background: disabled ? 'var(--bento-bg-secondary)' : 'var(--bento-bg-primary)',
      boxShadow: `inset 0 0 0 ${open || error ? 'var(--bento-border-width-strong)' : 'var(--bento-border-width)'} ${line}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      font: 'var(--bento-weight-regular) 16px/20px var(--bento-font-ui)',
      color: selectedLabel ? 'var(--bento-content-primary)' : 'var(--bento-content-secondary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, selectedLabel || placeholder), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: open ? 'ChevronUp' : 'ChevronDown',
    size: 24,
    style: {
      color: 'var(--bento-icon-secondary)'
    }
  })), open && !disabled && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 20,
      marginTop: 4,
      padding: 8,
      borderRadius: 'var(--bento-radius-24)',
      background: 'var(--bento-bg-primary)',
      boxShadow: 'inset 0 0 0 1px var(--bento-neutral-5), var(--bento-elevation-md)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, options.map((o, i) => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: () => {
        onChange && onChange(v);
        setOpen(false);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        border: 'none',
        borderRadius: 'var(--bento-radius-16)',
        background: v === value ? 'var(--bento-bg-interactive-overlay)' : 'transparent',
        font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-ui)',
        color: 'var(--bento-content-primary)',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, l);
  })), (errorText || assistiveText) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 12px/16px var(--bento-font-ui)',
      color: errorText ? 'var(--bento-content-negative)' : 'var(--bento-content-secondary)'
    }
  }, errorText || assistiveText)));
}
Object.assign(__ds_scope, { SelectField, __ds_default_components_forms_SelectField_1c4tx10: SelectField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SelectField.jsx", error: String((e && e.message) || e) }); }

// components/display/Pagination.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Pagination({
  page = 1,
  pageCount = 10,
  pageSize = 25,
  pageSizeOptions = ['10', '25', '50', '100'],
  kind = 'buttons',
  onPage,
  onPageSize,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 24,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      boxSizing: 'border-box',
      width: '100%',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, "Rows per page"), /*#__PURE__*/React.createElement(__ds_scope.SelectField, {
    label: "",
    options: pageSizeOptions,
    value: String(pageSize),
    onChange: onPageSize,
    width: 96
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, kind === 'buttons' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    label: "Previous",
    kind: "transparent",
    hierarchy: "secondary",
    size: "small",
    leadingIcon: "ChevronLeft",
    state: page <= 1 ? 'disabled' : 'enabled',
    onClick: () => onPage && onPage(page - 1)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)',
      padding: '0 24px'
    }
  }, "Page ", page, " of ", pageCount), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    label: "Next",
    kind: "transparent",
    hierarchy: "secondary",
    size: "small",
    trailingIcon: "ChevronRight",
    state: page >= pageCount ? 'disabled' : 'enabled',
    onClick: () => onPage && onPage(page + 1)
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "ChevronLeft",
    size: 24,
    label: "Previous page",
    state: page <= 1 ? 'disabled' : 'enabled',
    onClick: () => onPage && onPage(page - 1)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-weight-regular) 14px/20px var(--bento-font-ui)',
      color: 'var(--bento-content-secondary)'
    }
  }, page, " / ", pageCount), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "ChevronRight",
    size: 24,
    label: "Next page",
    state: page >= pageCount ? 'disabled' : 'enabled',
    onClick: () => onPage && onPage(page + 1)
  }))));
}
Object.assign(__ds_scope, { Pagination, __ds_default_components_display_Pagination_115d70p: Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Breadcrumb({
  items = [],
  onNavigate,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-legacy)',
      ...style
    }
  }, rest), items.map((it, i) => {
    const last = i === items.length - 1;
    const label = typeof it === 'string' ? it : it.label;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, last ? /*#__PURE__*/React.createElement("span", {
      "aria-current": "page",
      style: {
        color: 'var(--bento-content-primary)',
        whiteSpace: 'nowrap'
      }
    }, label) : /*#__PURE__*/React.createElement("a", {
      href: it && it.href || '#',
      onClick: onNavigate && (e => {
        e.preventDefault();
        onNavigate(i, it);
      }),
      style: {
        color: 'var(--bento-content-primary)',
        whiteSpace: 'nowrap',
        textDecoration: 'none'
      }
    }, label), !last && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "ChevronRight",
      size: 12,
      style: {
        color: 'var(--bento-icon-secondary)',
        flexShrink: 0
      }
    }));
  }));
}
Object.assign(__ds_scope, { Breadcrumb, __ds_default_components_navigation_Breadcrumb_1j6vgds: Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FolderTab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZE = {
  medium: {
    fontSize: 15,
    lineHeight: '18px'
  },
  large: {
    fontSize: 15,
    lineHeight: '18px'
  }
};
function FolderTab({
  label = 'Label',
  icon,
  badge,
  size = 'medium',
  state = 'enabled',
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const s = SIZE[size] || SIZE.medium;
  const active = state === 'active';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 40px',
      boxSizing: 'border-box',
      height: 48,
      border: 'none',
      borderRadius: '16px 16px 0px 0px',
      background: active ? 'var(--bento-bg-primary)' : 'rgba(255,255,255,0)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      font: `var(--bento-weight-medium) ${s.fontSize}px/${s.lineHeight} var(--bento-font-tabs)`,
      color: active ? 'var(--bento-content-primary)' : 'var(--bento-content-secondary)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24
  }), label, badge && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--bento-content-primary)',
      flexShrink: 0
    }
  }));
}
Object.assign(__ds_scope, { FolderTab, __ds_default_components_navigation_FolderTab_ncrrpo: FolderTab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FolderTab.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Menu.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Menu({
  header,
  items = [],
  width = 190,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "menu",
    style: {
      width,
      overflow: 'hidden',
      borderRadius: 24,
      background: 'var(--bento-bg-primary)',
      boxShadow: 'inset 0 0 0 1px var(--bento-neutral-5), var(--bento-elevation-md)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      ...style
    }
  }, rest), header && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 68,
      display: 'flex',
      flexDirection: 'row',
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      flexShrink: 0,
      alignSelf: 'stretch',
      font: 'var(--bento-weight-regular) 14px/18px var(--bento-font-legacy)',
      color: 'var(--bento-content-primary)'
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: 8,
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      flexShrink: 0,
      alignSelf: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.List, {
    items: items,
    width: "100%"
  })));
}
Object.assign(__ds_scope, { Menu, __ds_default_components_navigation_Menu_14b5sha: Menu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Menu.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavigationItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZE = {
  medium: {
    fontSize: 13,
    lineHeight: '16px'
  },
  large: {
    fontSize: 15,
    lineHeight: '18px'
  }
};
function NavigationItem({
  label = 'Label',
  icon,
  size = 'medium',
  active = false,
  state = 'enabled',
  onClick,
  style,
  ...rest
}) {
  const s = SIZE[size] || SIZE.medium;
  const disabled = state === 'disabled';
  const hover = state === 'hover';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    "aria-current": active ? 'page' : undefined,
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 16px',
      boxSizing: 'border-box',
      height: 48,
      border: 'none',
      borderRadius: 16,
      background: hover ? 'var(--bento-bg-interactive-overlay)' : 'transparent',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      font: `var(--bento-weight-medium) ${s.fontSize}px/${s.lineHeight} var(--bento-font-tabs)`,
      color: active ? 'var(--bento-content-primary)' : 'var(--bento-content-secondary)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24
  }), label, active && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      marginLeft: -8,
      bottom: 4,
      width: 16,
      height: 4,
      borderRadius: 2,
      background: 'var(--bento-brand-primary)'
    }
  }));
}
Object.assign(__ds_scope, { NavigationItem, __ds_default_components_navigation_NavigationItem_1alykns: NavigationItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavigationItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StepperItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FONT = 'var(--bento-weight-medium) 14px/18px var(--bento-font-component)';
function StepperItem({
  label = 'Label',
  index = 1,
  status = 'toDo',
  style,
  ...rest
}) {
  const done = status === 'done';
  const inProgress = status === 'inProgress';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      ...style
    }
  }, rest), done ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "PositiveSolid",
    size: 24,
    style: {
      color: 'var(--bento-icon-positive)',
      flexShrink: 0
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 16,
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: inProgress ? 'var(--bento-interactive-enabled)' : 'transparent',
      boxShadow: inProgress ? 'none' : 'inset 0 0 0 1px var(--bento-border-container)',
      font: FONT,
      letterSpacing: '0.020em',
      color: inProgress ? 'var(--bento-content-primary-inverse)' : 'var(--bento-content-secondary)'
    }
  }, index), /*#__PURE__*/React.createElement("span", {
    style: {
      font: FONT,
      letterSpacing: '0.020em',
      whiteSpace: 'nowrap',
      color: inProgress ? 'var(--bento-interactive-enabled)' : 'var(--bento-content-secondary)'
    }
  }, label));
}
Object.assign(__ds_scope, { StepperItem, __ds_default_components_navigation_StepperItem_1yvyox7: StepperItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StepperItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Stepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Stepper({
  steps = [],
  current = 0,
  orientation = 'vertical',
  style,
  ...rest
}) {
  const vertical = orientation === 'vertical';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      gap: vertical ? 24 : 40,
      alignItems: vertical ? 'flex-start' : 'center',
      ...style
    }
  }, rest), steps.map((s, i) => {
    const label = typeof s === 'string' ? s : s.label;
    const status = i < current ? 'done' : i === current ? 'inProgress' : 'toDo';
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement(__ds_scope.StepperItem, {
      label: label,
      index: i + 1,
      status: status
    }), !vertical && i < steps.length - 1 && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 24,
        height: 1,
        background: 'var(--bento-border-container)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Stepper, __ds_default_components_navigation_Stepper_cn800s: Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TabBar({
  kind = 'underline',
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'flex-end',
      borderBottom: kind === 'underline' ? '1px solid var(--bento-border-container)' : 'none',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { TabBar, __ds_default_components_navigation_TabBar_4yk81x: TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/UnderlineTab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZE = {
  medium: {
    fontSize: 13,
    lineHeight: '16px'
  },
  large: {
    fontSize: 15,
    lineHeight: '18px'
  }
};
function UnderlineTab({
  label = 'Label',
  icon,
  badge,
  size = 'medium',
  state = 'enabled',
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const s = SIZE[size] || SIZE.medium;
  const active = state === 'active';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 24px',
      boxSizing: 'border-box',
      height: 48,
      border: 'none',
      background: 'transparent',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      font: `var(--bento-weight-medium) ${s.fontSize}px/${s.lineHeight} var(--bento-font-tabs)`,
      color: active ? 'var(--bento-content-primary)' : 'var(--bento-content-secondary)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24
  }), label, badge && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--bento-dv-blue-50)',
      flexShrink: 0
    }
  }), active && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 2,
      background: 'var(--bento-dv-yellow-40)'
    }
  }));
}
Object.assign(__ds_scope, { UnderlineTab, __ds_default_components_navigation_UnderlineTab_3elrzq: UnderlineTab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/UnderlineTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/templates/AppShell.jsx
try { (() => {
const NS = () => window.BentoDS27_65ebe9;
const NAV = [{
  key: 'invoices',
  label: 'Invoices',
  icon: 'FileWeightRegular'
}, {
  key: 'settings',
  label: 'Settings',
  icon: 'GearWeightRegular'
}];
function AppShell({
  view,
  onView,
  children
}) {
  const {
    Icon,
    Avatar,
    SearchBar,
    IconButton,
    Divider
  } = NS();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      minHeight: 640,
      background: 'var(--bento-bg-secondary)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      background: 'var(--bento-bg-primary)',
      borderRight: '1px solid var(--bento-border-container)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/bento-ds-logo.svg",
    alt: "Bento",
    style: {
      height: 20,
      width: 'auto',
      alignSelf: 'flex-start',
      marginLeft: 8
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, NAV.map(n => {
    const on = view === n.key;
    return /*#__PURE__*/React.createElement("button", {
      key: n.key,
      onClick: () => onView(n.key),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        border: 'none',
        borderRadius: 'var(--bento-radius-12)',
        cursor: 'pointer',
        textAlign: 'left',
        background: on ? 'var(--bento-bg-interactive-overlay)' : 'transparent',
        color: on ? 'var(--bento-content-interactive)' : 'var(--bento-content-primary)',
        font: 'var(--bento-label-md)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 24
    }), n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    kind: "initials",
    initials: "JF",
    color: "violet",
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-body-sm-strong)'
    }
  }, "Jane Fonseca"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-body-sm)',
      color: 'var(--bento-content-secondary)'
    }
  }, "Acme Corp")))), /*#__PURE__*/React.createElement("main", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 32px',
      background: 'var(--bento-bg-primary)',
      borderBottom: '1px solid var(--bento-border-container)'
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    placeholder: "Search invoices, clients",
    width: 320
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "BellWeightRegular",
    kind: "transparent",
    size: 16,
    label: "Notifications"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "QuestionCircle",
    kind: "transparent",
    size: 16,
    label: "Help"
  }), /*#__PURE__*/React.createElement(Divider, {
    orientation: "vertical",
    length: 24
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "Logout",
    kind: "transparent",
    size: 16,
    label: "Sign out"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      flex: 1,
      minWidth: 0
    }
  }, children)));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/templates/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/templates/InvoiceForm.jsx
try { (() => {
const NS = () => window.BentoDS27_65ebe9;
function InvoiceForm({
  onCancel,
  onSave
}) {
  const {
    Card,
    Field,
    SelectField,
    Datepicker,
    Switch,
    RadioButton,
    Checkbox,
    Slider,
    FileUploader,
    Actions,
    Banner,
    Divider,
    FieldTip
  } = NS();
  const [client, setClient] = React.useState('Acme Corp');
  const [day, setDay] = React.useState(14);
  const [terms, setTerms] = React.useState('30');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 940
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--bento-headline-sm)',
      margin: 0
    }
  }, "New invoice"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--bento-body-md)',
      color: 'var(--bento-content-secondary)',
      margin: '8px 0 0'
    }
  }, "Draft saves automatically.")), /*#__PURE__*/React.createElement(Banner, {
    tone: "informative",
    text: "Numbering continues from INV-1041.",
    width: "100%"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-title-md)',
      marginBottom: 16
    }
  }, "Details"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SelectField, {
    label: "Client",
    options: ['Acme Corp', 'Baker & Co', 'Cordova'],
    value: client,
    onChange: setClient,
    width: "100%"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Reference",
    value: "INV-1042",
    width: "100%"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Amount",
    kind: "currency",
    value: "2480",
    width: "100%"
  }), /*#__PURE__*/React.createElement(SelectField, {
    label: "Currency",
    options: ['EUR', 'GBP', 'USD'],
    value: "EUR",
    width: "100%"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Tax",
    kind: "percentage",
    value: "21",
    width: "100%"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Discount",
    kind: "number",
    value: "0",
    unit: "%",
    width: "100%"
  })), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: '24px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--bento-label-md)'
    }
  }, "Payment terms"), /*#__PURE__*/React.createElement(FieldTip, {
    text: "Days until the invoice is considered overdue"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      marginBottom: 20
    }
  }, ['14', '30', '60'].map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    onClick: () => setTerms(t)
  }, /*#__PURE__*/React.createElement(RadioButton, {
    label: `${t} days`,
    name: "terms",
    checked: terms === t
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-label-md)',
      marginBottom: 8
    }
  }, "Late fee"), /*#__PURE__*/React.createElement(Slider, {
    value: 2,
    min: 0,
    max: 10,
    showValue: true,
    width: "100%"
  }), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: '24px 0'
    }
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Notes",
    kind: "textarea",
    placeholder: "Visible to the client on the invoice",
    width: "100%"
  }), /*#__PURE__*/React.createElement(FileUploader, {
    label: "Attachments",
    width: "100%",
    assistiveText: "PDF or PNG, up to 10 MB",
    style: {
      marginTop: 16
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-title-md)',
      marginBottom: 16
    }
  }, "Issue date"), /*#__PURE__*/React.createElement(Datepicker, {
    month: 9,
    year: 2026,
    selectedDay: day,
    onSelect: setDay
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-title-md)',
      marginBottom: 16
    }
  }, "Delivery"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Email the client",
    checked: true
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Send a reminder at 7 days"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Attach a payment link",
    checked: true
  }))))), /*#__PURE__*/React.createElement(Actions, {
    primaryLabel: "Create invoice",
    secondaryLabel: "Cancel",
    onPrimary: onSave,
    onSecondary: onCancel
  }));
}
Object.assign(window, {
  InvoiceForm
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/templates/InvoiceForm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/templates/InvoiceList.jsx
try { (() => {
const NS = () => window.BentoDS27_65ebe9;
const COLUMNS = [{
  key: 'client',
  label: 'Client',
  sortable: true
}, {
  key: 'issued',
  label: 'Issued',
  sortable: true
}, {
  key: 'due',
  label: 'Due'
}, {
  key: 'status',
  label: 'Status',
  kind: 'chip'
}, {
  key: 'total',
  label: 'Total',
  align: 'right',
  sortable: true
}];
const STATUS_COLOR = {
  Paid: 'jade',
  Sent: 'blue',
  Overdue: 'red',
  Draft: 'grey'
};
function InvoiceList({
  rows,
  onNew
}) {
  const {
    Table,
    Pagination,
    Chip,
    Button,
    Card,
    ProgressBar,
    Feedback,
    Toast
  } = NS();
  const [selected, setSelected] = React.useState([]);
  const [sortBy, setSortBy] = React.useState('client');
  const [dir, setDir] = React.useState('asc');
  const [toast, setToast] = React.useState(null);
  const [filter, setFilter] = React.useState('All');
  const shown = React.useMemo(() => {
    const f = filter === 'All' ? rows : rows.filter(r => r.status === filter);
    return [...f].sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1) * (dir === 'asc' ? 1 : -1));
  }, [rows, filter, sortBy, dir]);
  const columns = COLUMNS.map(c => c.kind === 'chip' ? {
    ...c,
    chipColor: 'jade'
  } : c);
  const paid = rows.filter(r => r.status === 'Paid').length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--bento-headline-sm)',
      margin: 0
    }
  }, "Invoices"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--bento-body-md)',
      color: 'var(--bento-content-secondary)',
      margin: '8px 0 0'
    }
  }, rows.length, " invoices \xB7 ", paid, " paid")), /*#__PURE__*/React.createElement(Button, {
    label: "New invoice",
    leadingIcon: "PlusWeightBold",
    style: {
      marginLeft: 'auto'
    },
    onClick: onNew
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-label-md)',
      color: 'var(--bento-content-secondary)'
    }
  }, "Outstanding"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-display-sm)',
      marginTop: 8
    }
  }, "\u20AC12,480")), /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-label-md)',
      color: 'var(--bento-content-secondary)'
    }
  }, "Collected this quarter"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-display-sm)',
      marginTop: 8
    }
  }, "\u20AC48,900")), /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-label-md)',
      color: 'var(--bento-content-secondary)'
    }
  }, "Quarterly target"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 68,
    tone: "positive",
    width: "100%",
    style: {
      marginTop: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-body-sm)',
      color: 'var(--bento-content-secondary)',
      marginTop: 8
    }
  }, "68% of \u20AC72,000"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, ['All', 'Paid', 'Sent', 'Overdue', 'Draft'].map(f => /*#__PURE__*/React.createElement("span", {
    key: f,
    onClick: () => setFilter(f),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    label: f,
    color: f === filter ? 'violet' : 'grey'
  }))), selected.length > 0 && /*#__PURE__*/React.createElement(Button, {
    label: `Send ${selected.length} selected`,
    kind: "outline",
    size: "small",
    style: {
      marginLeft: 'auto'
    },
    onClick: () => {
      setToast(`${selected.length} invoices sent`);
      setSelected([]);
    }
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    elevation: "none",
    style: {
      overflow: 'hidden'
    }
  }, shown.length === 0 ? /*#__PURE__*/React.createElement(Feedback, {
    size: "medium",
    title: "Nothing here",
    text: `No ${filter.toLowerCase()} invoices right now.`,
    icon: "FileWeightRegular",
    style: {
      padding: 48
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Table, {
    columns: columns.map(c => c.key === 'status' ? {
      ...c,
      chipColor: STATUS_COLOR[shown[0].status]
    } : c),
    rows: shown,
    selectable: true,
    selectedRows: selected,
    onToggleRow: i => setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]),
    sortBy: sortBy,
    sortDir: dir,
    onSort: k => {
      setDir(k === sortBy && dir === 'asc' ? 'desc' : 'asc');
      setSortBy(k);
    },
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: 1,
    pageCount: 4,
    pageSize: 10,
    style: {
      padding: 16
    }
  }))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 32,
      bottom: 32,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "positive",
    text: toast,
    dismissible: true,
    onDismiss: () => setToast(null)
  })));
}
Object.assign(window, {
  InvoiceList
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/templates/InvoiceList.jsx", error: String((e && e.message) || e) }); }

// ui_kits/templates/Settings.jsx
try { (() => {
const NS = () => window.BentoDS27_65ebe9;
function Settings() {
  const {
    Card,
    Field,
    SelectField,
    Switch,
    Checkbox,
    Avatar,
    Button,
    Divider,
    List,
    Banner,
    InlineLoader,
    AreaLoader,
    Tooltip,
    Chip
  } = NS();
  const [busy, setBusy] = React.useState(false);
  const [section, setSection] = React.useState('Profile');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--bento-headline-sm)',
      margin: 0
    }
  }, "Settings"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(List, {
    width: 240,
    items: ['Profile', 'Notifications', 'Billing'].map(s => ({
      firstLine: s,
      selected: s === section,
      leadingIcon: s === 'Profile' ? 'UserWeightRegular' : s === 'Notifications' ? 'BellWeightRegular' : 'FileWeightRegular',
      onClick: () => setSection(s)
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    kind: "initials",
    initials: "JF",
    color: "violet"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-title-md)'
    }
  }, "Jane Fonseca"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-body-sm)',
      color: 'var(--bento-content-secondary)'
    }
  }, "Owner \xB7 Acme Corp")), /*#__PURE__*/React.createElement(Chip, {
    label: "Admin",
    color: "violet",
    style: {
      marginLeft: 8
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Change photo",
    kind: "outline",
    size: "small",
    style: {
      marginLeft: 'auto'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "First name",
    value: "Jane",
    width: "100%"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Last name",
    value: "Fonseca",
    width: "100%"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Work email",
    value: "jane@acme.com",
    width: "100%",
    assistiveText: "Used for sign-in"
  }), /*#__PURE__*/React.createElement(SelectField, {
    label: "Time zone",
    options: ['UTC+00:00 London', 'UTC+01:00 Lisbon', 'UTC+02:00 Berlin'],
    value: "UTC+01:00 Lisbon",
    width: "100%"
  })), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: '24px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Weekly summary email",
    checked: true
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Product announcements"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Allow teammates to see my activity",
    checked: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Save changes",
    onClick: () => {
      setBusy(true);
      setTimeout(() => setBusy(false), 1200);
    }
  }), busy && /*#__PURE__*/React.createElement(InlineLoader, {
    text: "Saving",
    size: 16
  }), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Changes apply immediately",
    style: {
      marginLeft: 'auto'
    }
  }))), /*#__PURE__*/React.createElement(Banner, {
    tone: "warning",
    title: "Two-factor authentication is off",
    text: "Turn it on to protect the account.",
    primaryLabel: "Set up",
    secondaryLabel: "Dismiss",
    width: "100%"
  }), busy && /*#__PURE__*/React.createElement(AreaLoader, {
    waitingTime: "short"
  }))));
}
Object.assign(window, {
  Settings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/templates/Settings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/templates/SignIn.jsx
try { (() => {
const NS = () => window.BentoDS27_65ebe9;
function SignIn({
  onSignIn
}) {
  const {
    Button,
    Field,
    Checkbox,
    Link,
    Banner
  } = NS();
  const [email, setEmail] = React.useState('jane@acme.com');
  const [error, setError] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: 640,
      background: 'var(--bento-bg-primary)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 80px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/bento-ds-logo.svg",
    alt: "Bento",
    style: {
      height: 26,
      width: 'auto',
      alignSelf: 'flex-start',
      marginBottom: 40
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--bento-headline-md)',
      margin: 0,
      marginBottom: 12
    }
  }, "Sign in"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--bento-body-lg)',
      color: 'var(--bento-content-secondary)',
      margin: 0,
      marginBottom: 32
    }
  }, "Use your work account to continue."), error && /*#__PURE__*/React.createElement(Banner, {
    tone: "negative",
    text: "That password does not match our records.",
    width: "100%",
    style: {
      marginBottom: 24
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Work email",
    value: email,
    onChange: e => setEmail(e.target.value),
    width: "100%",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    kind: "password",
    value: "",
    placeholder: "Enter your password",
    width: "100%",
    required: true,
    assistiveText: "At least 12 characters"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Keep me signed in",
    checked: true
  }), /*#__PURE__*/React.createElement(Link, {
    label: "Forgot password?",
    href: "#",
    size: "small"
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Sign in",
    fullWidth: true,
    size: "large",
    onClick: () => email.includes('@') ? onSignIn() : setError(true)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--bento-body-md)',
      color: 'var(--bento-content-secondary)'
    }
  }, "No account yet? ", /*#__PURE__*/React.createElement(Link, {
    label: "Request access",
    href: "#",
    size: "medium"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `var(--bento-brand-primary) url(../../assets/images/login-hero.jpg) center/cover no-repeat`
    }
  }));
}
Object.assign(window, {
  SignIn
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/templates/SignIn.jsx", error: String((e && e.message) || e) }); }

if (__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 === undefined) __ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 = __ds_scope.__ds_default_components_icons_icon_data_12stud1;

__ds_ns.Actions = __ds_scope.Actions;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Link = __ds_scope.Link;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.ChartTooltip = __ds_scope.ChartTooltip;

__ds_ns.DonutChart = __ds_scope.DonutChart;

__ds_ns.Legend = __ds_scope.Legend;

__ds_ns.LineChart = __ds_scope.LineChart;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.ListItem = __ds_scope.ListItem;

__ds_ns.List = __ds_scope.List;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.AreaLoader = __ds_scope.AreaLoader;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.Disclosure = __ds_scope.Disclosure;

__ds_ns.Feedback = __ds_scope.Feedback;

__ds_ns.InlineLoader = __ds_scope.InlineLoader;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Datepicker = __ds_scope.Datepicker;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.FieldTip = __ds_scope.FieldTip;

__ds_ns.FileUploader = __ds_scope.FileUploader;

__ds_ns.RadioButton = __ds_scope.RadioButton;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.SelectField = __ds_scope.SelectField;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.FolderTab = __ds_scope.FolderTab;

__ds_ns.Menu = __ds_scope.Menu;

__ds_ns.NavigationItem = __ds_scope.NavigationItem;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.StepperItem = __ds_scope.StepperItem;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.UnderlineTab = __ds_scope.UnderlineTab;

})();
