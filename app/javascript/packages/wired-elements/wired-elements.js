var WebElementsShowcase = (function(e) {
  'use strict';
  const t = new WeakMap(),
    i = e => 'function' == typeof e && t.has(e),
    s =
      void 0 !== window.customElements &&
      void 0 !== window.customElements.polyfillWrapFlushCallback,
    o = (e, t, i = null) => {
      for (; t !== i; ) {
        const i = t.nextSibling;
        e.removeChild(t), (t = i);
      }
    },
    r = {},
    n = {},
    a = `{{lit-${String(Math.random()).slice(2)}}}`,
    d = `\x3c!--${a}--\x3e`,
    l = new RegExp(`${a}|${d}`),
    c = '$lit$';
  class h {
    constructor(e, t) {
      (this.parts = []), (this.element = t);
      const i = [],
        s = [],
        o = document.createTreeWalker(t.content, 133, null, !1);
      let r = 0,
        n = -1,
        d = 0;
      const {
        strings: h,
        values: { length: u }
      } = e;
      for (; d < u; ) {
        const e = o.nextNode();
        if (null !== e) {
          if ((n++, 1 === e.nodeType)) {
            if (e.hasAttributes()) {
              const t = e.attributes,
                { length: i } = t;
              let s = 0;
              for (let e = 0; e < i; e++) p(t[e].name, c) && s++;
              for (; s-- > 0; ) {
                const t = h[d],
                  i = f.exec(t)[2],
                  s = i.toLowerCase() + c,
                  o = e.getAttribute(s);
                e.removeAttribute(s);
                const r = o.split(l);
                this.parts.push({
                  type: 'attribute',
                  index: n,
                  name: i,
                  strings: r
                }),
                  (d += r.length - 1);
              }
            }
            'TEMPLATE' === e.tagName &&
              (s.push(e), (o.currentNode = e.content));
          } else if (3 === e.nodeType) {
            const t = e.data;
            if (t.indexOf(a) >= 0) {
              const s = e.parentNode,
                o = t.split(l),
                r = o.length - 1;
              for (let t = 0; t < r; t++) {
                let i,
                  r = o[t];
                if ('' === r) i = g();
                else {
                  const e = f.exec(r);
                  null !== e &&
                    p(e[2], c) &&
                    (r =
                      r.slice(0, e.index) +
                      e[1] +
                      e[2].slice(0, -c.length) +
                      e[3]),
                    (i = document.createTextNode(r));
                }
                s.insertBefore(i, e),
                  this.parts.push({ type: 'node', index: ++n });
              }
              '' === o[r]
                ? (s.insertBefore(g(), e), i.push(e))
                : (e.data = o[r]),
                (d += r);
            }
          } else if (8 === e.nodeType)
            if (e.data === a) {
              const t = e.parentNode;
              (null !== e.previousSibling && n !== r) ||
                (n++, t.insertBefore(g(), e)),
                (r = n),
                this.parts.push({ type: 'node', index: n }),
                null === e.nextSibling ? (e.data = '') : (i.push(e), n--),
                d++;
            } else {
              let t = -1;
              for (; -1 !== (t = e.data.indexOf(a, t + 1)); )
                this.parts.push({ type: 'node', index: -1 }), d++;
            }
        } else o.currentNode = s.pop();
      }
      for (const e of i) e.parentNode.removeChild(e);
    }
  }
  const p = (e, t) => {
      const i = e.length - t.length;
      return i >= 0 && e.slice(i) === t;
    },
    u = e => -1 !== e.index,
    g = () => document.createComment(''),
    f = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
  class m {
    constructor(e, t, i) {
      (this.__parts = []),
        (this.template = e),
        (this.processor = t),
        (this.options = i);
    }
    update(e) {
      let t = 0;
      for (const i of this.__parts) void 0 !== i && i.setValue(e[t]), t++;
      for (const e of this.__parts) void 0 !== e && e.commit();
    }
    _clone() {
      const e = s
          ? this.template.element.content.cloneNode(!0)
          : document.importNode(this.template.element.content, !0),
        t = [],
        i = this.template.parts,
        o = document.createTreeWalker(e, 133, null, !1);
      let r,
        n = 0,
        a = 0,
        d = o.nextNode();
      for (; n < i.length; )
        if (((r = i[n]), u(r))) {
          for (; a < r.index; )
            a++,
              'TEMPLATE' === d.nodeName &&
                (t.push(d), (o.currentNode = d.content)),
              null === (d = o.nextNode()) &&
                ((o.currentNode = t.pop()), (d = o.nextNode()));
          if ('node' === r.type) {
            const e = this.processor.handleTextExpression(this.options);
            e.insertAfterNode(d.previousSibling), this.__parts.push(e);
          } else
            this.__parts.push(
              ...this.processor.handleAttributeExpressions(
                d,
                r.name,
                r.strings,
                this.options
              )
            );
          n++;
        } else this.__parts.push(void 0), n++;
      return s && (document.adoptNode(e), customElements.upgrade(e)), e;
    }
  }
  const b = ` ${a} `;
  class y {
    constructor(e, t, i, s) {
      (this.strings = e),
        (this.values = t),
        (this.type = i),
        (this.processor = s);
    }
    getHTML() {
      const e = this.strings.length - 1;
      let t = '',
        i = !1;
      for (let s = 0; s < e; s++) {
        const e = this.strings[s],
          o = e.lastIndexOf('\x3c!--');
        i = (o > -1 || i) && -1 === e.indexOf('--\x3e', o + 1);
        const r = f.exec(e);
        t +=
          null === r
            ? e + (i ? b : d)
            : e.substr(0, r.index) + r[1] + r[2] + c + r[3] + a;
      }
      return (t += this.strings[e]);
    }
    getTemplateElement() {
      const e = document.createElement('template');
      return (e.innerHTML = this.getHTML()), e;
    }
  }
  const v = e =>
      null === e || !('object' == typeof e || 'function' == typeof e),
    w = e => Array.isArray(e) || !(!e || !e[Symbol.iterator]);
  class x {
    constructor(e, t, i) {
      (this.dirty = !0),
        (this.element = e),
        (this.name = t),
        (this.strings = i),
        (this.parts = []);
      for (let e = 0; e < i.length - 1; e++) this.parts[e] = this._createPart();
    }
    _createPart() {
      return new k(this);
    }
    _getValue() {
      const e = this.strings,
        t = e.length - 1;
      let i = '';
      for (let s = 0; s < t; s++) {
        i += e[s];
        const t = this.parts[s];
        if (void 0 !== t) {
          const e = t.value;
          if (v(e) || !w(e)) i += 'string' == typeof e ? e : String(e);
          else for (const t of e) i += 'string' == typeof t ? t : String(t);
        }
      }
      return (i += e[t]);
    }
    commit() {
      this.dirty &&
        ((this.dirty = !1),
        this.element.setAttribute(this.name, this._getValue()));
    }
  }
  class k {
    constructor(e) {
      (this.value = void 0), (this.committer = e);
    }
    setValue(e) {
      e === r ||
        (v(e) && e === this.value) ||
        ((this.value = e), i(e) || (this.committer.dirty = !0));
    }
    commit() {
      for (; i(this.value); ) {
        const e = this.value;
        (this.value = r), e(this);
      }
      this.value !== r && this.committer.commit();
    }
  }
  class R {
    constructor(e) {
      (this.value = void 0), (this.__pendingValue = void 0), (this.options = e);
    }
    appendInto(e) {
      (this.startNode = e.appendChild(g())),
        (this.endNode = e.appendChild(g()));
    }
    insertAfterNode(e) {
      (this.startNode = e), (this.endNode = e.nextSibling);
    }
    appendIntoPart(e) {
      e.__insert((this.startNode = g())), e.__insert((this.endNode = g()));
    }
    insertAfterPart(e) {
      e.__insert((this.startNode = g())),
        (this.endNode = e.endNode),
        (e.endNode = this.startNode);
    }
    setValue(e) {
      this.__pendingValue = e;
    }
    commit() {
      for (; i(this.__pendingValue); ) {
        const e = this.__pendingValue;
        (this.__pendingValue = r), e(this);
      }
      const e = this.__pendingValue;
      e !== r &&
        (v(e)
          ? e !== this.value && this.__commitText(e)
          : e instanceof y
          ? this.__commitTemplateResult(e)
          : e instanceof Node
          ? this.__commitNode(e)
          : w(e)
          ? this.__commitIterable(e)
          : e === n
          ? ((this.value = n), this.clear())
          : this.__commitText(e));
    }
    __insert(e) {
      this.endNode.parentNode.insertBefore(e, this.endNode);
    }
    __commitNode(e) {
      this.value !== e && (this.clear(), this.__insert(e), (this.value = e));
    }
    __commitText(e) {
      const t = this.startNode.nextSibling,
        i = 'string' == typeof (e = null == e ? '' : e) ? e : String(e);
      t === this.endNode.previousSibling && 3 === t.nodeType
        ? (t.data = i)
        : this.__commitNode(document.createTextNode(i)),
        (this.value = e);
    }
    __commitTemplateResult(e) {
      const t = this.options.templateFactory(e);
      if (this.value instanceof m && this.value.template === t)
        this.value.update(e.values);
      else {
        const i = new m(t, e.processor, this.options),
          s = i._clone();
        i.update(e.values), this.__commitNode(s), (this.value = i);
      }
    }
    __commitIterable(e) {
      Array.isArray(this.value) || ((this.value = []), this.clear());
      const t = this.value;
      let i,
        s = 0;
      for (const o of e)
        void 0 === (i = t[s]) &&
          ((i = new R(this.options)),
          t.push(i),
          0 === s ? i.appendIntoPart(this) : i.insertAfterPart(t[s - 1])),
          i.setValue(o),
          i.commit(),
          s++;
      s < t.length && ((t.length = s), this.clear(i && i.endNode));
    }
    clear(e = this.startNode) {
      o(this.startNode.parentNode, e.nextSibling, this.endNode);
    }
  }
  class S {
    constructor(e, t, i) {
      if (
        ((this.value = void 0),
        (this.__pendingValue = void 0),
        2 !== i.length || '' !== i[0] || '' !== i[1])
      )
        throw new Error(
          'Boolean attributes can only contain a single expression'
        );
      (this.element = e), (this.name = t), (this.strings = i);
    }
    setValue(e) {
      this.__pendingValue = e;
    }
    commit() {
      for (; i(this.__pendingValue); ) {
        const e = this.__pendingValue;
        (this.__pendingValue = r), e(this);
      }
      if (this.__pendingValue === r) return;
      const e = !!this.__pendingValue;
      this.value !== e &&
        (e
          ? this.element.setAttribute(this.name, '')
          : this.element.removeAttribute(this.name),
        (this.value = e)),
        (this.__pendingValue = r);
    }
  }
  class O extends x {
    constructor(e, t, i) {
      super(e, t, i),
        (this.single = 2 === i.length && '' === i[0] && '' === i[1]);
    }
    _createPart() {
      return new C(this);
    }
    _getValue() {
      return this.single ? this.parts[0].value : super._getValue();
    }
    commit() {
      this.dirty &&
        ((this.dirty = !1), (this.element[this.name] = this._getValue()));
    }
  }
  class C extends k {}
  let z = !1;
  try {
    const e = {
      get capture() {
        return (z = !0), !1;
      }
    };
    window.addEventListener('test', e, e),
      window.removeEventListener('test', e, e);
  } catch (e) {}
  class j {
    constructor(e, t, i) {
      (this.value = void 0),
        (this.__pendingValue = void 0),
        (this.element = e),
        (this.eventName = t),
        (this.eventContext = i),
        (this.__boundHandleEvent = e => this.handleEvent(e));
    }
    setValue(e) {
      this.__pendingValue = e;
    }
    commit() {
      for (; i(this.__pendingValue); ) {
        const e = this.__pendingValue;
        (this.__pendingValue = r), e(this);
      }
      if (this.__pendingValue === r) return;
      const e = this.__pendingValue,
        t = this.value,
        s =
          null == e ||
          (null != t &&
            (e.capture !== t.capture ||
              e.once !== t.once ||
              e.passive !== t.passive)),
        o = null != e && (null == t || s);
      s &&
        this.element.removeEventListener(
          this.eventName,
          this.__boundHandleEvent,
          this.__options
        ),
        o &&
          ((this.__options = _(e)),
          this.element.addEventListener(
            this.eventName,
            this.__boundHandleEvent,
            this.__options
          )),
        (this.value = e),
        (this.__pendingValue = r);
    }
    handleEvent(e) {
      'function' == typeof this.value
        ? this.value.call(this.eventContext || this.element, e)
        : this.value.handleEvent(e);
    }
  }
  const _ = e =>
    e &&
    (z ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture);
  const M = new (class {
    handleAttributeExpressions(e, t, i, s) {
      const o = t[0];
      if ('.' === o) {
        return new O(e, t.slice(1), i).parts;
      }
      return '@' === o
        ? [new j(e, t.slice(1), s.eventContext)]
        : '?' === o
        ? [new S(e, t.slice(1), i)]
        : new x(e, t, i).parts;
    }
    handleTextExpression(e) {
      return new R(e);
    }
  })();
  function $(e) {
    let t = P.get(e.type);
    void 0 === t &&
      ((t = { stringsArray: new WeakMap(), keyString: new Map() }),
      P.set(e.type, t));
    let i = t.stringsArray.get(e.strings);
    if (void 0 !== i) return i;
    const s = e.strings.join(a);
    return (
      void 0 === (i = t.keyString.get(s)) &&
        ((i = new h(e, e.getTemplateElement())), t.keyString.set(s, i)),
      t.stringsArray.set(e.strings, i),
      i
    );
  }
  const P = new Map(),
    N = new WeakMap();
  (window.litHtmlVersions || (window.litHtmlVersions = [])).push('1.1.2');
  const E = (e, ...t) => new y(e, t, 'html', M),
    D = 133;
  function A(e, t) {
    const {
        element: { content: i },
        parts: s
      } = e,
      o = document.createTreeWalker(i, D, null, !1);
    let r = T(s),
      n = s[r],
      a = -1,
      d = 0;
    const l = [];
    let c = null;
    for (; o.nextNode(); ) {
      a++;
      const e = o.currentNode;
      for (
        e.previousSibling === c && (c = null),
          t.has(e) && (l.push(e), null === c && (c = e)),
          null !== c && d++;
        void 0 !== n && n.index === a;

      )
        (n.index = null !== c ? -1 : n.index - d), (n = s[(r = T(s, r))]);
    }
    l.forEach(e => e.parentNode.removeChild(e));
  }
  const L = e => {
      let t = 11 === e.nodeType ? 0 : 1;
      const i = document.createTreeWalker(e, D, null, !1);
      for (; i.nextNode(); ) t++;
      return t;
    },
    T = (e, t = -1) => {
      for (let i = t + 1; i < e.length; i++) {
        const t = e[i];
        if (u(t)) return i;
      }
      return -1;
    };
  const I = (e, t) => `${e}--${t}`;
  let q = !0;
  void 0 === window.ShadyCSS
    ? (q = !1)
    : void 0 === window.ShadyCSS.prepareTemplateDom &&
      (console.warn(
        'Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1.'
      ),
      (q = !1));
  const B = e => t => {
      const i = I(t.type, e);
      let s = P.get(i);
      void 0 === s &&
        ((s = { stringsArray: new WeakMap(), keyString: new Map() }),
        P.set(i, s));
      let o = s.stringsArray.get(t.strings);
      if (void 0 !== o) return o;
      const r = t.strings.join(a);
      if (void 0 === (o = s.keyString.get(r))) {
        const i = t.getTemplateElement();
        q && window.ShadyCSS.prepareTemplateDom(i, e),
          (o = new h(t, i)),
          s.keyString.set(r, o);
      }
      return s.stringsArray.set(t.strings, o), o;
    },
    H = ['html', 'svg'],
    V = new Set(),
    U = (e, t, i) => {
      V.add(e);
      const s = i ? i.element : document.createElement('template'),
        o = t.querySelectorAll('style'),
        { length: r } = o;
      if (0 === r) return void window.ShadyCSS.prepareTemplateStyles(s, e);
      const n = document.createElement('style');
      for (let e = 0; e < r; e++) {
        const t = o[e];
        t.parentNode.removeChild(t), (n.textContent += t.textContent);
      }
      (e => {
        H.forEach(t => {
          const i = P.get(I(t, e));
          void 0 !== i &&
            i.keyString.forEach(e => {
              const {
                  element: { content: t }
                } = e,
                i = new Set();
              Array.from(t.querySelectorAll('style')).forEach(e => {
                i.add(e);
              }),
                A(e, i);
            });
        });
      })(e);
      const a = s.content;
      i
        ? (function(e, t, i = null) {
            const {
              element: { content: s },
              parts: o
            } = e;
            if (null == i) return void s.appendChild(t);
            const r = document.createTreeWalker(s, D, null, !1);
            let n = T(o),
              a = 0,
              d = -1;
            for (; r.nextNode(); ) {
              for (
                d++,
                  r.currentNode === i &&
                    ((a = L(t)), i.parentNode.insertBefore(t, i));
                -1 !== n && o[n].index === d;

              ) {
                if (a > 0) {
                  for (; -1 !== n; ) (o[n].index += a), (n = T(o, n));
                  return;
                }
                n = T(o, n);
              }
            }
          })(i, n, a.firstChild)
        : a.insertBefore(n, a.firstChild),
        window.ShadyCSS.prepareTemplateStyles(s, e);
      const d = a.querySelector('style');
      if (window.ShadyCSS.nativeShadow && null !== d)
        t.insertBefore(d.cloneNode(!0), t.firstChild);
      else if (i) {
        a.insertBefore(n, a.firstChild);
        const e = new Set();
        e.add(n), A(i, e);
      }
    };
  window.JSCompiler_renameProperty = (e, t) => e;
  const F = {
      toAttribute(e, t) {
        switch (t) {
          case Boolean:
            return e ? '' : null;
          case Object:
          case Array:
            return null == e ? e : JSON.stringify(e);
        }
        return e;
      },
      fromAttribute(e, t) {
        switch (t) {
          case Boolean:
            return null !== e;
          case Number:
            return null === e ? null : Number(e);
          case Object:
          case Array:
            return JSON.parse(e);
        }
        return e;
      }
    },
    W = (e, t) => t !== e && (t == t || e == e),
    Y = {
      attribute: !0,
      type: String,
      converter: F,
      reflect: !1,
      hasChanged: W
    },
    G = Promise.resolve(!0),
    X = 1,
    J = 4,
    K = 8,
    Q = 16,
    Z = 32,
    ee = 'finalized';
  class te extends HTMLElement {
    constructor() {
      super(),
        (this._updateState = 0),
        (this._instanceProperties = void 0),
        (this._updatePromise = G),
        (this._hasConnectedResolver = void 0),
        (this._changedProperties = new Map()),
        (this._reflectingProperties = void 0),
        this.initialize();
    }
    static get observedAttributes() {
      this.finalize();
      const e = [];
      return (
        this._classProperties.forEach((t, i) => {
          const s = this._attributeNameForProperty(i, t);
          void 0 !== s && (this._attributeToPropertyMap.set(s, i), e.push(s));
        }),
        e
      );
    }
    static _ensureClassProperties() {
      if (
        !this.hasOwnProperty(
          JSCompiler_renameProperty('_classProperties', this)
        )
      ) {
        this._classProperties = new Map();
        const e = Object.getPrototypeOf(this)._classProperties;
        void 0 !== e && e.forEach((e, t) => this._classProperties.set(t, e));
      }
    }
    static createProperty(e, t = Y) {
      if (
        (this._ensureClassProperties(),
        this._classProperties.set(e, t),
        t.noAccessor || this.prototype.hasOwnProperty(e))
      )
        return;
      const i = 'symbol' == typeof e ? Symbol() : `__${e}`;
      Object.defineProperty(this.prototype, e, {
        get() {
          return this[i];
        },
        set(t) {
          const s = this[e];
          (this[i] = t), this._requestUpdate(e, s);
        },
        configurable: !0,
        enumerable: !0
      });
    }
    static finalize() {
      const e = Object.getPrototypeOf(this);
      if (
        (e.hasOwnProperty(ee) || e.finalize(),
        (this[ee] = !0),
        this._ensureClassProperties(),
        (this._attributeToPropertyMap = new Map()),
        this.hasOwnProperty(JSCompiler_renameProperty('properties', this)))
      ) {
        const e = this.properties,
          t = [
            ...Object.getOwnPropertyNames(e),
            ...('function' == typeof Object.getOwnPropertySymbols
              ? Object.getOwnPropertySymbols(e)
              : [])
          ];
        for (const i of t) this.createProperty(i, e[i]);
      }
    }
    static _attributeNameForProperty(e, t) {
      const i = t.attribute;
      return !1 === i
        ? void 0
        : 'string' == typeof i
        ? i
        : 'string' == typeof e
        ? e.toLowerCase()
        : void 0;
    }
    static _valueHasChanged(e, t, i = W) {
      return i(e, t);
    }
    static _propertyValueFromAttribute(e, t) {
      const i = t.type,
        s = t.converter || F,
        o = 'function' == typeof s ? s : s.fromAttribute;
      return o ? o(e, i) : e;
    }
    static _propertyValueToAttribute(e, t) {
      if (void 0 === t.reflect) return;
      const i = t.type,
        s = t.converter;
      return ((s && s.toAttribute) || F.toAttribute)(e, i);
    }
    initialize() {
      this._saveInstanceProperties(), this._requestUpdate();
    }
    _saveInstanceProperties() {
      this.constructor._classProperties.forEach((e, t) => {
        if (this.hasOwnProperty(t)) {
          const e = this[t];
          delete this[t],
            this._instanceProperties || (this._instanceProperties = new Map()),
            this._instanceProperties.set(t, e);
        }
      });
    }
    _applyInstanceProperties() {
      this._instanceProperties.forEach((e, t) => (this[t] = e)),
        (this._instanceProperties = void 0);
    }
    connectedCallback() {
      (this._updateState = this._updateState | Z),
        this._hasConnectedResolver &&
          (this._hasConnectedResolver(), (this._hasConnectedResolver = void 0));
    }
    disconnectedCallback() {}
    attributeChangedCallback(e, t, i) {
      t !== i && this._attributeToProperty(e, i);
    }
    _propertyToAttribute(e, t, i = Y) {
      const s = this.constructor,
        o = s._attributeNameForProperty(e, i);
      if (void 0 !== o) {
        const e = s._propertyValueToAttribute(t, i);
        if (void 0 === e) return;
        (this._updateState = this._updateState | K),
          null == e ? this.removeAttribute(o) : this.setAttribute(o, e),
          (this._updateState = this._updateState & ~K);
      }
    }
    _attributeToProperty(e, t) {
      if (this._updateState & K) return;
      const i = this.constructor,
        s = i._attributeToPropertyMap.get(e);
      if (void 0 !== s) {
        const e = i._classProperties.get(s) || Y;
        (this._updateState = this._updateState | Q),
          (this[s] = i._propertyValueFromAttribute(t, e)),
          (this._updateState = this._updateState & ~Q);
      }
    }
    _requestUpdate(e, t) {
      let i = !0;
      if (void 0 !== e) {
        const s = this.constructor,
          o = s._classProperties.get(e) || Y;
        s._valueHasChanged(this[e], t, o.hasChanged)
          ? (this._changedProperties.has(e) ||
              this._changedProperties.set(e, t),
            !0 !== o.reflect ||
              this._updateState & Q ||
              (void 0 === this._reflectingProperties &&
                (this._reflectingProperties = new Map()),
              this._reflectingProperties.set(e, o)))
          : (i = !1);
      }
      !this._hasRequestedUpdate && i && this._enqueueUpdate();
    }
    requestUpdate(e, t) {
      return this._requestUpdate(e, t), this.updateComplete;
    }
    async _enqueueUpdate() {
      let e, t;
      this._updateState = this._updateState | J;
      const i = this._updatePromise;
      this._updatePromise = new Promise((i, s) => {
        (e = i), (t = s);
      });
      try {
        await i;
      } catch (e) {}
      this._hasConnected ||
        (await new Promise(e => (this._hasConnectedResolver = e)));
      try {
        const e = this.performUpdate();
        null != e && (await e);
      } catch (e) {
        t(e);
      }
      e(!this._hasRequestedUpdate);
    }
    get _hasConnected() {
      return this._updateState & Z;
    }
    get _hasRequestedUpdate() {
      return this._updateState & J;
    }
    get hasUpdated() {
      return this._updateState & X;
    }
    performUpdate() {
      this._instanceProperties && this._applyInstanceProperties();
      let e = !1;
      const t = this._changedProperties;
      try {
        (e = this.shouldUpdate(t)) && this.update(t);
      } catch (t) {
        throw ((e = !1), t);
      } finally {
        this._markUpdated();
      }
      e &&
        (this._updateState & X ||
          ((this._updateState = this._updateState | X), this.firstUpdated(t)),
        this.updated(t));
    }
    _markUpdated() {
      (this._changedProperties = new Map()),
        (this._updateState = this._updateState & ~J);
    }
    get updateComplete() {
      return this._getUpdateComplete();
    }
    _getUpdateComplete() {
      return this._updatePromise;
    }
    shouldUpdate(e) {
      return !0;
    }
    update(e) {
      void 0 !== this._reflectingProperties &&
        this._reflectingProperties.size > 0 &&
        (this._reflectingProperties.forEach((e, t) =>
          this._propertyToAttribute(t, this[t], e)
        ),
        (this._reflectingProperties = void 0));
    }
    updated(e) {}
    firstUpdated(e) {}
  }
  te[ee] = !0;
  const ie = e => t =>
      'function' == typeof t
        ? ((e, t) => (window.customElements.define(e, t), t))(e, t)
        : ((e, t) => {
            const { kind: i, elements: s } = t;
            return {
              kind: i,
              elements: s,
              finisher(t) {
                window.customElements.define(e, t);
              }
            };
          })(e, t),
    se = (e, t) =>
      'method' !== t.kind || !t.descriptor || 'value' in t.descriptor
        ? {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            initializer() {
              'function' == typeof t.initializer &&
                (this[t.key] = t.initializer.call(this));
            },
            finisher(i) {
              i.createProperty(t.key, e);
            }
          }
        : Object.assign({}, t, {
            finisher(i) {
              i.createProperty(t.key, e);
            }
          }),
    oe = (e, t, i) => {
      t.constructor.createProperty(i, e);
    };
  function re(e) {
    return (t, i) => (void 0 !== i ? oe(e, t, i) : se(e, t));
  }
  function ne(e) {
    return (t, i) => {
      const s = {
        get() {
          return this.renderRoot.querySelector(e);
        },
        enumerable: !0,
        configurable: !0
      };
      return void 0 !== i ? ae(s, t, i) : de(s, t);
    };
  }
  const ae = (e, t, i) => {
      Object.defineProperty(t, i, e);
    },
    de = (e, t) => ({
      kind: 'method',
      placement: 'prototype',
      key: t.key,
      descriptor: e
    }),
    le =
      'adoptedStyleSheets' in Document.prototype &&
      'replace' in CSSStyleSheet.prototype,
    ce = Symbol();
  class he {
    constructor(e, t) {
      if (t !== ce)
        throw new Error(
          'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'
        );
      this.cssText = e;
    }
    get styleSheet() {
      return (
        void 0 === this._styleSheet &&
          (le
            ? ((this._styleSheet = new CSSStyleSheet()),
              this._styleSheet.replaceSync(this.cssText))
            : (this._styleSheet = null)),
        this._styleSheet
      );
    }
    toString() {
      return this.cssText;
    }
  }
  const pe = (e, ...t) => {
    const i = t.reduce(
      (t, i, s) =>
        t +
        (e => {
          if (e instanceof he) return e.cssText;
          if ('number' == typeof e) return e;
          throw new Error(
            `Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`
          );
        })(i) +
        e[s + 1],
      e[0]
    );
    return new he(i, ce);
  };
  (window.litElementVersions || (window.litElementVersions = [])).push('2.2.1');
  const ue = e =>
    e.flat
      ? e.flat(1 / 0)
      : (function e(t, i = []) {
          for (let s = 0, o = t.length; s < o; s++) {
            const o = t[s];
            Array.isArray(o) ? e(o, i) : i.push(o);
          }
          return i;
        })(e);
  class ge extends te {
    static finalize() {
      super.finalize.call(this),
        (this._styles = this.hasOwnProperty(
          JSCompiler_renameProperty('styles', this)
        )
          ? this._getUniqueStyles()
          : this._styles || []);
    }
    static _getUniqueStyles() {
      const e = this.styles,
        t = [];
      if (Array.isArray(e)) {
        ue(e)
          .reduceRight((e, t) => (e.add(t), e), new Set())
          .forEach(e => t.unshift(e));
      } else e && t.push(e);
      return t;
    }
    initialize() {
      super.initialize(),
        (this.renderRoot = this.createRenderRoot()),
        window.ShadowRoot &&
          this.renderRoot instanceof window.ShadowRoot &&
          this.adoptStyles();
    }
    createRenderRoot() {
      return this.attachShadow({ mode: 'open' });
    }
    adoptStyles() {
      const e = this.constructor._styles;
      0 !== e.length &&
        (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow
          ? le
            ? (this.renderRoot.adoptedStyleSheets = e.map(e => e.styleSheet))
            : (this._needsShimAdoptedStyleSheets = !0)
          : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
              e.map(e => e.cssText),
              this.localName
            ));
    }
    connectedCallback() {
      super.connectedCallback(),
        this.hasUpdated &&
          void 0 !== window.ShadyCSS &&
          window.ShadyCSS.styleElement(this);
    }
    update(e) {
      super.update(e);
      const t = this.render();
      t instanceof y &&
        this.constructor.render(t, this.renderRoot, {
          scopeName: this.localName,
          eventContext: this
        }),
        this._needsShimAdoptedStyleSheets &&
          ((this._needsShimAdoptedStyleSheets = !1),
          this.constructor._styles.forEach(e => {
            const t = document.createElement('style');
            (t.textContent = e.cssText), this.renderRoot.appendChild(t);
          }));
    }
    render() {}
  }
  (ge.finalized = !0),
    (ge.render = (e, t, i) => {
      if (!i || 'object' != typeof i || !i.scopeName)
        throw new Error('The `scopeName` option is required.');
      const s = i.scopeName,
        r = N.has(t),
        n = q && 11 === t.nodeType && !!t.host,
        a = n && !V.has(s),
        d = a ? document.createDocumentFragment() : t;
      if (
        (((e, t, i) => {
          let s = N.get(t);
          void 0 === s &&
            (o(t, t.firstChild),
            N.set(t, (s = new R(Object.assign({ templateFactory: $ }, i)))),
            s.appendInto(t)),
            s.setValue(e),
            s.commit();
        })(e, d, Object.assign({ templateFactory: B(s) }, i)),
        a)
      ) {
        const e = N.get(d);
        N.delete(d);
        const i = e.value instanceof m ? e.value.template : void 0;
        U(s, d, i), o(t, t.firstChild), t.appendChild(d), N.set(t, e);
      }
      !r && n && window.ShadyCSS.styleElement(t.host);
    });
  const fe = [
    {
      name: 'wired-button',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-button'
    },
    {
      name: 'wired-calendar',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-calendar'
    },
    {
      name: 'wired-card',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-card'
    },
    {
      name: 'wired-checkbox',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-checkbox'
    },
    {
      name: 'wired-combo',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-combo'
    },
    {
      name: 'wired-dialog',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-dialog'
    },
    {
      name: 'wired-divider',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-divider'
    },
    {
      name: 'wired-fab',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-fab'
    },
    {
      name: 'wired-icon-button',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-icon-button'
    },
    {
      name: 'wired-image',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-image'
    },
    {
      name: 'wired-input',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-input'
    },
    {
      name: 'wired-link',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-link'
    },
    {
      name: 'wired-listbox',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-listbox'
    },
    {
      name: 'wired-progress',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-progress'
    },
    {
      name: 'wired-radio',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-radio'
    },
    {
      name: 'wired-search-input',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-search-input'
    },
    {
      name: 'wired-slider',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-slider'
    },
    {
      name: 'wired-spinner',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-spinner'
    },
    {
      name: 'wired-tabs',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-tabs'
    },
    {
      name: 'wired-textarea',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-textarea'
    },
    {
      name: 'wired-toggle',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-toggle'
    },
    {
      name: 'wired-video',
      url:
        'https://github.com/wiredjs/wired-elements/tree/master/packages/wired-video'
    }
  ];
  const me = pe`
.layout.horizontal,
.layout.vertical {
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.layout.horizontal {
  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;
}
.layout.vertical {
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
}
.layout.center {
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.layout.wrap {
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
}
.flex {
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;
}
`,
    be = (e, t) => {
      const i = e.startNode.parentNode,
        s = void 0 === t ? e.endNode : t.startNode,
        o = i.insertBefore(g(), s);
      i.insertBefore(g(), s);
      const r = new R(e.options);
      return r.insertAfterNode(o), r;
    },
    ye = (e, t) => (e.setValue(t), e.commit(), e),
    ve = (e, t, i) => {
      const s = e.startNode.parentNode,
        o = i ? i.startNode : e.endNode,
        r = t.endNode.nextSibling;
      r !== o &&
        ((e, t, i = null, s = null) => {
          for (; t !== i; ) {
            const i = t.nextSibling;
            e.insertBefore(t, s), (t = i);
          }
        })(s, t.startNode, r, o);
    },
    we = e => {
      o(e.startNode.parentNode, e.startNode, e.endNode.nextSibling);
    },
    xe = (e, t, i) => {
      const s = new Map();
      for (let o = t; o <= i; o++) s.set(e[o], o);
      return s;
    },
    ke = new WeakMap(),
    Re = new WeakMap(),
    Se = (e => (...i) => {
      const s = e(...i);
      return t.set(s, !0), s;
    })((e, t, i) => {
      let s;
      return (
        void 0 === i ? (i = t) : void 0 !== t && (s = t),
        t => {
          if (!(t instanceof R))
            throw new Error('repeat can only be used in text bindings');
          const o = ke.get(t) || [],
            r = Re.get(t) || [],
            n = [],
            a = [],
            d = [];
          let l,
            c,
            h = 0;
          for (const t of e) (d[h] = s ? s(t, h) : h), (a[h] = i(t, h)), h++;
          let p = 0,
            u = o.length - 1,
            g = 0,
            f = a.length - 1;
          for (; p <= u && g <= f; )
            if (null === o[p]) p++;
            else if (null === o[u]) u--;
            else if (r[p] === d[g]) (n[g] = ye(o[p], a[g])), p++, g++;
            else if (r[u] === d[f]) (n[f] = ye(o[u], a[f])), u--, f--;
            else if (r[p] === d[f])
              (n[f] = ye(o[p], a[f])), ve(t, o[p], n[f + 1]), p++, f--;
            else if (r[u] === d[g])
              (n[g] = ye(o[u], a[g])), ve(t, o[u], o[p]), u--, g++;
            else if (
              (void 0 === l && ((l = xe(d, g, f)), (c = xe(r, p, u))),
              l.has(r[p]))
            )
              if (l.has(r[u])) {
                const e = c.get(d[g]),
                  i = void 0 !== e ? o[e] : null;
                if (null === i) {
                  const e = be(t, o[p]);
                  ye(e, a[g]), (n[g] = e);
                } else (n[g] = ye(i, a[g])), ve(t, i, o[p]), (o[e] = null);
                g++;
              } else we(o[u]), u--;
            else we(o[p]), p++;
          for (; g <= f; ) {
            const e = be(t, n[f + 1]);
            ye(e, a[g]), (n[g++] = e);
          }
          for (; p <= u; ) {
            const e = o[p++];
            null !== e && we(e);
          }
          ke.set(t, n), Re.set(t, d);
        }
      );
    });
  var Oe = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Ce = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let ze = class extends ge {
    constructor() {
      super(...arguments),
        (this.drawerOpen = !1),
        (this.resizeListener = this.onResize.bind(this));
    }
    static get styles() {
      return pe`
    :host {
      display: block;
    }
    .hidden {
      display: none !important;
    }
    #shell {
      min-height: 100vh;
      box-sizing: border-box;
      padding-left: var(--soso-app-drawer-width, 200px);
      position: relative;
    }
    main {
      display: block;
      box-sizing: border-box;
    }
    .barSpacer {
      height: var(--soso-app-toolbar-height, 52px);
    }
    #toolbarPanel {
      position: fixed;
      top: 0;
      left: var(--soso-app-drawer-width, 200px);
      right: 0;
      box-sizing: border-box;
      --soso-appbar-nav-display: none;
    }
    #glass {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      opacity: 0;
      transition: opacity 0.28s ease;
      pointer-events: none;
    }
    #drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: var(--soso-app-drawer-width, 200px);
      border-right: var(--soso-app-drawer-border, none);
      will-change: transform;
      overflow: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background: var(--soso-drawer-overlay-bg, #f0f0f0);
    }

    @media (max-width: 840px) {
      #shell {
        padding: 0;
      }
      #shell.open #glass {
        opacity: 1;
        pointer-events: auto;
      }
      #toolbarPanel {
        --soso-appbar-nav-display: block;
        left: 0;
      }
      #drawer {
        z-index: 1;
        transform: translate3d(-290px, 0, 0);
        background: var(--soso-drawer-overlay-bg, white);
        box-shadow: 3px 0 5px -2px rgba(0,0,0,0.4);
        transition: transform 0.3s ease;
      }
      #shell.open #drawer {
        transform: translate3d(0, 0, 0);
      }
    }
    `;
    }
    render() {
      return E`
    <div id="shell" class="${this.drawerOpen ? 'open' : ''}">
      <main>
        <div class="barSpacer"></div>
        <slot name="main"></slot>
      </main>

      <div id="toolbarPanel" @toggle-nav="${this.toggleDrawer}">
        <slot name="toolbar"></slot>
      </div>

      <div id="glass" @click="${this.closeDrawer}"></div>

      <div id="drawer">
        <slot name="drawer"></slot>
      </div>
    </div>
    `;
    }
    connectedCallback() {
      super.connectedCallback(),
        window.removeEventListener('resize', this.resizeListener),
        window.addEventListener('resize', this.resizeListener, { passive: !0 });
    }
    disconnectedCallback() {
      super.disconnectedCallback(),
        window.removeEventListener('resize', this.resizeListener);
    }
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    }
    closeDrawer() {
      this.drawerOpen = !1;
    }
    onResize() {
      this.drawerOpen && this.closeDrawer();
    }
  };
  Oe([re(), Ce('design:type', Object)], ze.prototype, 'drawerOpen', void 0),
    (ze = Oe([ie('soso-app-shell')], ze));
  const je = new (class {
    constructor() {
      (this.map = new Map()), (this.maps = new Map());
    }
    get(e, t) {
      const i = t ? this.maps.get(t) : this.map;
      return i && i.has(e) ? i.get(e) : '';
    }
    define(e, t) {
      let i = this.map;
      t &&
        (this.maps.has(t) || this.maps.set(t, new Map()),
        (i = this.maps.get(t)));
      for (const t in e) i.set(t, e[t]);
    }
  })();
  var _e = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Me = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let $e = class extends ge {
    static get styles() {
      return pe`
      :host {
        display: -ms-inline-flexbox;
        display: -webkit-inline-flex;
        display: inline-flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        fill: currentColor;
        stroke: none;
        width: 24px;
        height: 24px;
        box-sizing: initial;
      }
      svg {
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
      }
    `;
    }
    render() {
      const e = this.icon || '',
        t = je.get(e, this.iconkey);
      return E`
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g>
        <path d="${t}"></path>
      </g>
    </svg>
    `;
    }
  };
  _e(
    [re({ type: String }), Me('design:type', String)],
    $e.prototype,
    'icon',
    void 0
  ),
    _e(
      [re({ type: String }), Me('design:type', String)],
      $e.prototype,
      'iconkey',
      void 0
    ),
    ($e = _e([ie('soso-icon')], $e));
  var Pe = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Ne = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Ee = class extends ge {
    constructor() {
      super(...arguments), (this.disabled = !1);
    }
    static get styles() {
      return pe`
    :host {
      display: inline-block;
    }
    button {
      background: none;
      cursor: pointer;
      outline: none;
      border: none;
      border-radius: 50%;
      overflow: hidden;
      padding: var(--soso-icon-button-padding, 10px);
      color: inherit;
      user-select: none;
      position: relative;
    }
    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: currentColor;
      opacity: var(--soso-icon-button-before-opacity, 0);
      pointer-events: none;
    }
    button:focus::before {
      opacity: var(--soso-icon-button-before-opacity, 0.1);
    }
    button soso-icon {
      transition: transform 0.3s ease;
    }
    button:active soso-icon {
      transform: scale(1.15);
    }
    button:disabled {
      opacity: 0.8;
      color: var(--soso-disabled-color, #808080);
      cursor: initial;
      pointer-events: none;
    }

    @media (hover: hover) {
      button:hover::before {
        opacity: var(--soso-icon-button-before-opacity, 0.05);
      }
      button:focus::before {
        opacity: var(--soso-icon-button-before-opacity, 0.1);
      }
    }
    `;
    }
    render() {
      return E`
    <button ?disabled="${this.disabled}">
      <soso-icon .icon="${this.icon}" .iconkey="${this.iconkey}"></soso-icon>
    </button>`;
    }
    updated(e) {
      e.has('disabled') &&
        (this.style.pointerEvents = this.disabled ? 'none' : null);
    }
  };
  function De(e, t, i, s = !0, o = !0) {
    if (t) {
      const r = {
        bubbles: 'boolean' != typeof s || s,
        composed: 'boolean' != typeof o || o
      };
      i && (r.detail = i);
      const n = window.SlickCustomEvent || CustomEvent;
      e.dispatchEvent(new n(t, r));
    }
  }
  Pe(
    [re({ type: String }), Ne('design:type', String)],
    Ee.prototype,
    'icon',
    void 0
  ),
    Pe(
      [re({ type: String }), Ne('design:type', String)],
      Ee.prototype,
      'iconkey',
      void 0
    ),
    Pe(
      [re({ type: Boolean }), Ne('design:type', Object)],
      Ee.prototype,
      'disabled',
      void 0
    ),
    (Ee = Pe([ie('soso-icon-button')], Ee));
  let Ae = class extends ge {
    static get styles() {
      return [
        me,
        pe`
      :host {
        display: block;
        color: white;
        background: #018786;
        font-size: 1.25rem;
      }
      #toolbar {
        padding: 4px;
        height: 52px;
        overflow: hidden;
        box-sizing: border-box;
      }
      #nav {
        display: var(--soso-appbar-nav-display, block);
      }
      #center {
        padding: 0 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
        box-sizing: border-box;
        line-height: 1;
      }
      #center ::slotted(*) {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .hidden {
        display: none !important;
      }
      `
      ];
    }
    render() {
      return E`
    <header id="toolbar" class="horizontal layout center">
      <section id="nav" @click="${this.navClick}">
        <slot name="nav"></slot>
      </section>
      <section id="leading" class="horizontal layout center">
        <slot name="leading"></slot>
      </section>
      <section id="center" class="flex">
        <slot name="title"></slot>
      </section>
      <section id="actions" class="horizontal layout center">
        <slot name="actions"></slot>
      </section>
    </header>
    `;
    }
    navClick() {
      De(this, 'toggle-nav');
    }
  };
  Ae = (function(e, t, i, s) {
    var o,
      r = arguments.length,
      n =
        r < 3
          ? t
          : null === s
          ? (s = Object.getOwnPropertyDescriptor(t, i))
          : s;
    if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
      n = Reflect.decorate(e, t, i, s);
    else
      for (var a = e.length - 1; a >= 0; a--)
        (o = e[a]) && (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
    return r > 3 && n && Object.defineProperty(t, i, n), n;
  })([ie('soso-app-bar')], Ae);
  var Le = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Te = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Ie = class extends ge {
    constructor() {
      super(...arguments), (this.horizontal = !1);
    }
    static get styles() {
      return [
        me,
        pe`
      :host {
        display: inline-block;
        box-sizing: border-box;
      }
      `
      ];
    }
    render() {
      return E`
    <div class="${
      this.horizontal ? 'horizontal' : 'vertical'
    } layout" @click="${this.onClick}">
      <slot></slot>
    </div>
    `;
    }
    updated() {
      (this.slotElement.assignedNodes() || [])
        .filter(e => e.nodeType === Node.ELEMENT_NODE)
        .forEach(e => {
          const t = e;
          t.selected = !(!this.selected || t.value !== this.selected);
        });
    }
    onClick(e) {
      e.stopPropagation();
      const t = e.target && e.target.value;
      t &&
        t !== this.selected &&
        ((this.selected = t), De(this, 'change', { selected: t }));
    }
  };
  Le([re(), Te('design:type', String)], Ie.prototype, 'selected', void 0),
    Le(
      [re({ type: Boolean }), Te('design:type', Object)],
      Ie.prototype,
      'horizontal',
      void 0
    ),
    Le(
      [ne('slot'), Te('design:type', HTMLSlotElement)],
      Ie.prototype,
      'slotElement',
      void 0
    ),
    (Ie = Le([ie('soso-list')], Ie));
  var qe = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Be = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let He = class extends ge {
    constructor() {
      super(...arguments), (this.value = ''), (this.selected = !1);
    }
    static get styles() {
      return pe`
    :host {
      display: inline-block;
      font-size: 14px;
      text-align: left;
    }
    button {
      cursor: pointer;
      outline: none;
      overflow: hidden;
      color: inherit;
      user-select: none;
      position: relative;
      font-family: inherit;
      text-align: inherit;
      font-size: inherit;
      letter-spacing: 1.25px;
      padding: 1px 10px;
      min-height: 36px;
      text-transform: inherit;
      background: none;
      border: none;
      transition: background-color 0.3s ease, color 0.3s ease;
      width: 100%;
      box-sizing: border-box;
    }
    button.selected {
      background: var(--soso-highlight-color, #018786);
      color: var(--soso-highlight-foreground, white);
    }
    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: currentColor;
      opacity: 0;
    }
    button span {
      display: inline-block;
      transition: transform 0.2s ease;
    }
    button:active span {
      transform: scale(1.02);
    }

    @media (hover: hover) {
      button:hover::before {
        opacity: 0.05;
      }
    }
    `;
    }
    render() {
      return E`
    <button class="${this.selected ? 'selected' : ''}">
      <span>
        <slot></slot>
      </span>
    </button>`;
    }
  };
  qe([re(), Be('design:type', Object)], He.prototype, 'value', void 0),
    qe(
      [re({ type: Boolean }), Be('design:type', Object)],
      He.prototype,
      'selected',
      void 0
    ),
    (He = qe([ie('soso-item')], He));
  var Ve = function(e, t) {
    if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
      return Reflect.metadata(e, t);
  };
  const Ue = pe`
:host {
  opacity: 0;
}
:host(.wired-rendered) {
  opacity: 1;
}
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
svg {
  display: block;
}
path {
  stroke: currentColor;
  stroke-width: 0.7;
  fill: transparent;
}
.hidden {
  display: none !important;
}
`;
  class Fe extends ge {
    constructor() {
      super(...arguments), (this.lastSize = [0, 0]);
    }
    updated(e) {
      this.wiredRender();
    }
    wiredRender(e = !1) {
      if (this.svg) {
        const t = this.canvasSize();
        if (!e && t[0] === this.lastSize[0] && t[1] === this.lastSize[1])
          return;
        for (; this.svg.hasChildNodes(); )
          this.svg.removeChild(this.svg.lastChild);
        this.svg.setAttribute('width', `${t[0]}`),
          this.svg.setAttribute('height', `${t[1]}`),
          this.draw(this.svg, t),
          (this.lastSize = t),
          this.classList.add('wired-rendered');
      }
    }
  }
  (function(e, t, i, s) {
    var o,
      r = arguments.length,
      n =
        r < 3
          ? t
          : null === s
          ? (s = Object.getOwnPropertyDescriptor(t, i))
          : s;
    if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
      n = Reflect.decorate(e, t, i, s);
    else
      for (var a = e.length - 1; a >= 0; a--)
        (o = e[a]) && (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
    r > 3 && n && Object.defineProperty(t, i, n);
  })(
    [ne('svg'), Ve('design:type', SVGSVGElement)],
    Fe.prototype,
    'svg',
    void 0
  );
  class We {
    constructor(e, t) {
      (this.xi = Number.MAX_VALUE),
        (this.yi = Number.MAX_VALUE),
        (this.px1 = e[0]),
        (this.py1 = e[1]),
        (this.px2 = t[0]),
        (this.py2 = t[1]),
        (this.a = this.py2 - this.py1),
        (this.b = this.px1 - this.px2),
        (this.c = this.px2 * this.py1 - this.px1 * this.py2),
        (this._undefined = 0 === this.a && 0 === this.b && 0 === this.c);
    }
    isUndefined() {
      return this._undefined;
    }
    intersects(e) {
      if (this.isUndefined() || e.isUndefined()) return !1;
      let t = Number.MAX_VALUE,
        i = Number.MAX_VALUE,
        s = 0,
        o = 0;
      const r = this.a,
        n = this.b,
        a = this.c;
      return (
        Math.abs(n) > 1e-5 && ((t = -r / n), (s = -a / n)),
        Math.abs(e.b) > 1e-5 && ((i = -e.a / e.b), (o = -e.c / e.b)),
        t === Number.MAX_VALUE
          ? i === Number.MAX_VALUE
            ? -a / r == -e.c / e.a &&
              (this.py1 >= Math.min(e.py1, e.py2) &&
              this.py1 <= Math.max(e.py1, e.py2)
                ? ((this.xi = this.px1), (this.yi = this.py1), !0)
                : this.py2 >= Math.min(e.py1, e.py2) &&
                  this.py2 <= Math.max(e.py1, e.py2) &&
                  ((this.xi = this.px2), (this.yi = this.py2), !0))
            : ((this.xi = this.px1),
              (this.yi = i * this.xi + o),
              !(
                (this.py1 - this.yi) * (this.yi - this.py2) < -1e-5 ||
                (e.py1 - this.yi) * (this.yi - e.py2) < -1e-5
              ) &&
                (!(Math.abs(e.a) < 1e-5) ||
                  !((e.px1 - this.xi) * (this.xi - e.px2) < -1e-5)))
          : i === Number.MAX_VALUE
          ? ((this.xi = e.px1),
            (this.yi = t * this.xi + s),
            !(
              (e.py1 - this.yi) * (this.yi - e.py2) < -1e-5 ||
              (this.py1 - this.yi) * (this.yi - this.py2) < -1e-5
            ) &&
              (!(Math.abs(r) < 1e-5) ||
                !((this.px1 - this.xi) * (this.xi - this.px2) < -1e-5)))
          : t === i
          ? s === o &&
            (this.px1 >= Math.min(e.px1, e.px2) &&
            this.px1 <= Math.max(e.py1, e.py2)
              ? ((this.xi = this.px1), (this.yi = this.py1), !0)
              : this.px2 >= Math.min(e.px1, e.px2) &&
                this.px2 <= Math.max(e.px1, e.px2) &&
                ((this.xi = this.px2), (this.yi = this.py2), !0))
          : ((this.xi = (o - s) / (t - i)),
            (this.yi = t * this.xi + s),
            !(
              (this.px1 - this.xi) * (this.xi - this.px2) < -1e-5 ||
              (e.px1 - this.xi) * (this.xi - e.px2) < -1e-5
            ))
      );
    }
  }
  class Ye {
    constructor(e, t, i, s, o, r, n, a) {
      (this.deltaX = 0),
        (this.hGap = 0),
        (this.top = e),
        (this.bottom = t),
        (this.left = i),
        (this.right = s),
        (this.gap = o),
        (this.sinAngle = r),
        (this.tanAngle = a),
        Math.abs(r) < 1e-4
          ? (this.pos = i + o)
          : Math.abs(r) > 0.9999
          ? (this.pos = e + o)
          : ((this.deltaX = (t - e) * Math.abs(a)),
            (this.pos = i - Math.abs(this.deltaX)),
            (this.hGap = Math.abs(o / n)),
            (this.sLeft = new We([i, t], [i, e])),
            (this.sRight = new We([s, t], [s, e])));
    }
    nextLine() {
      if (Math.abs(this.sinAngle) < 1e-4) {
        if (this.pos < this.right) {
          const e = [this.pos, this.top, this.pos, this.bottom];
          return (this.pos += this.gap), e;
        }
      } else if (Math.abs(this.sinAngle) > 0.9999) {
        if (this.pos < this.bottom) {
          const e = [this.left, this.pos, this.right, this.pos];
          return (this.pos += this.gap), e;
        }
      } else {
        let e = this.pos - this.deltaX / 2,
          t = this.pos + this.deltaX / 2,
          i = this.bottom,
          s = this.top;
        if (this.pos < this.right + this.deltaX) {
          for (
            ;
            (e < this.left && t < this.left) ||
            (e > this.right && t > this.right);

          )
            if (
              ((this.pos += this.hGap),
              (e = this.pos - this.deltaX / 2),
              (t = this.pos + this.deltaX / 2),
              this.pos > this.right + this.deltaX)
            )
              return null;
          const o = new We([e, i], [t, s]);
          this.sLeft && o.intersects(this.sLeft) && ((e = o.xi), (i = o.yi)),
            this.sRight &&
              o.intersects(this.sRight) &&
              ((t = o.xi), (s = o.yi)),
            this.tanAngle > 0 &&
              ((e = this.right - (e - this.left)),
              (t = this.right - (t - this.left)));
          const r = [e, i, t, s];
          return (this.pos += this.hGap), r;
        }
      }
      return null;
    }
  }
  function Ge(e, t) {
    const i = [],
      s = new We([e[0], e[1]], [e[2], e[3]]);
    for (let e = 0; e < t.length; e++) {
      const o = new We(t[e], t[(e + 1) % t.length]);
      s.intersects(o) && i.push([s.xi, s.yi]);
    }
    return i;
  }
  function Xe(e, t, i, s, o, r, n) {
    return [
      -i * r - s * o + i + r * e + o * t,
      n * (i * o - s * r) + s + -n * o * e + n * r * t
    ];
  }
  const Je = 2,
    Ke = 1,
    Qe = 0.85,
    Ze = 0,
    et = 9;
  class tt {
    constructor() {
      this.p = '';
    }
    get value() {
      return this.p.trim();
    }
    moveTo(e, t) {
      this.p = `${this.p}M ${e} ${t} `;
    }
    bcurveTo(e, t, i, s, o, r) {
      this.p = `${this.p}C ${e} ${t}, ${i} ${s}, ${o} ${r} `;
    }
  }
  function it(e, t) {
    const i = document.createElementNS('http://www.w3.org/2000/svg', e);
    if (t) for (const e in t) i.setAttributeNS(null, e, t[e]);
    return i;
  }
  function st(e, t) {
    return Ke * (Math.random() * (t - e) + e);
  }
  function ot(e, t, i, s, o) {
    const r = Math.pow(e - i, 2) + Math.pow(t - s, 2);
    let n = Je;
    n * n * 100 > r && (n = Math.sqrt(r) / 10);
    const a = n / 2,
      d = 0.2 + 0.2 * Math.random();
    let l = (Qe * Je * (s - t)) / 200,
      c = (Qe * Je * (e - i)) / 200;
    (l = st(-l, l)), (c = st(-c, c));
    const h = o || new tt();
    return (
      h.moveTo(e + st(-n, n), t + st(-n, n)),
      h.bcurveTo(
        l + e + (i - e) * d + st(-n, n),
        c + t + (s - t) * d + st(-n, n),
        l + e + 2 * (i - e) * d + st(-n, n),
        c + t + 2 * (s - t) * d + st(-n, n),
        i + st(-n, n),
        s + st(-n, n)
      ),
      h.moveTo(e + st(-a, a), t + st(-a, a)),
      h.bcurveTo(
        l + e + (i - e) * d + st(-a, a),
        c + t + (s - t) * d + st(-a, a),
        l + e + 2 * (i - e) * d + st(-a, a),
        c + t + 2 * (s - t) * d + st(-a, a),
        i + st(-a, a),
        s + st(-a, a)
      ),
      h
    );
  }
  function rt(e, t, i, s, o = !1, r = !1, n) {
    n = n || new tt();
    const a = Math.pow(e - i, 2) + Math.pow(t - s, 2);
    let d = Je;
    d * d * 100 > a && (d = Math.sqrt(a) / 10);
    const l = d / 2,
      c = 0.2 + 0.2 * Math.random();
    let h = (Qe * Je * (s - t)) / 200,
      p = (Qe * Je * (e - i)) / 200;
    return (
      (h = st(-h, h)),
      (p = st(-p, p)),
      o && n.moveTo(e + st(-d, d), t + st(-d, d)),
      r
        ? n.bcurveTo(
            h + e + (i - e) * c + st(-l, l),
            p + t + (s - t) * c + st(-l, l),
            h + e + 2 * (i - e) * c + st(-l, l),
            p + t + 2 * (s - t) * c + st(-l, l),
            i + st(-l, l),
            s + st(-l, l)
          )
        : n.bcurveTo(
            h + e + (i - e) * c + st(-d, d),
            p + t + (s - t) * c + st(-d, d),
            h + e + 2 * (i - e) * c + st(-d, d),
            p + t + 2 * (s - t) * c + st(-d, d),
            i + st(-d, d),
            s + st(-d, d)
          ),
      n
    );
  }
  function nt(e, t, i, s, o, r, n, a) {
    const d = st(-0.5, 0.5) - Math.PI / 2,
      l = [];
    l.push([
      st(-r, r) + t + 0.9 * s * Math.cos(d - e),
      st(-r, r) + i + 0.9 * o * Math.sin(d - e)
    ]);
    for (let n = d; n < 2 * Math.PI + d - 0.01; n += e)
      l.push([
        st(-r, r) + t + s * Math.cos(n),
        st(-r, r) + i + o * Math.sin(n)
      ]);
    return (
      l.push([
        st(-r, r) + t + s * Math.cos(d + 2 * Math.PI + 0.5 * n),
        st(-r, r) + i + o * Math.sin(d + 2 * Math.PI + 0.5 * n)
      ]),
      l.push([
        st(-r, r) + t + 0.98 * s * Math.cos(d + n),
        st(-r, r) + i + 0.98 * o * Math.sin(d + n)
      ]),
      l.push([
        st(-r, r) + t + 0.9 * s * Math.cos(d + 0.5 * n),
        st(-r, r) + i + 0.9 * o * Math.sin(d + 0.5 * n)
      ]),
      (function(e, t) {
        const i = e.length;
        let s = t || new tt();
        if (i > 3) {
          const t = [],
            o = 1 - Ze;
          s.moveTo(e[1][0], e[1][1]);
          for (let r = 1; r + 2 < i; r++) {
            const i = e[r];
            (t[0] = [i[0], i[1]]),
              (t[1] = [
                i[0] + (o * e[r + 1][0] - o * e[r - 1][0]) / 6,
                i[1] + (o * e[r + 1][1] - o * e[r - 1][1]) / 6
              ]),
              (t[2] = [
                e[r + 1][0] + (o * e[r][0] - o * e[r + 2][0]) / 6,
                e[r + 1][1] + (o * e[r][1] - o * e[r + 2][1]) / 6
              ]),
              (t[3] = [e[r + 1][0], e[r + 1][1]]),
              s.bcurveTo(t[1][0], t[1][1], t[2][0], t[2][1], t[3][0], t[3][1]);
          }
        } else
          3 === i
            ? (s.moveTo(e[0][0], e[0][1]),
              s.bcurveTo(e[1][0], e[1][1], e[2][0], e[2][1], e[2][0], e[2][1]))
            : 2 === i && (s = ot(e[0][0], e[0][1], e[1][0], e[1][1], s));
        return s;
      })(l, a)
    );
  }
  function at(e, t, i, s, o) {
    const r = it('path', { d: ot(t, i, s, o).value });
    return e.appendChild(r), r;
  }
  function dt(e, t, i, s, o) {
    o -= 4;
    let r = ot((t += 2), (i += 2), t + (s -= 4), i);
    (r = ot(t + s, i, t + s, i + o, r)), (r = ot(t + s, i + o, t, i + o, r));
    const n = it('path', { d: (r = ot(t, i + o, t, i, r)).value });
    return e.appendChild(n), n;
  }
  function lt(e, t, i, s, o) {
    (s = Math.max(s > 10 ? s - 4 : s - 1, 1)),
      (o = Math.max(o > 10 ? o - 4 : o - 1, 1));
    const r = (2 * Math.PI) / et;
    let n = Math.abs(s / 2),
      a = Math.abs(o / 2),
      d = nt(
        r,
        t,
        i,
        (n += st(0.05 * -n, 0.05 * n)),
        (a += st(0.05 * -a, 0.05 * a)),
        1,
        r * st(0.1, st(0.4, 1))
      );
    const l = it('path', { d: (d = nt(r, t, i, n, a, 1.5, 0, d)).value });
    return e.appendChild(l), l;
  }
  function ct(e) {
    const t = it('g');
    let i = null;
    return (
      e.forEach(e => {
        at(t, e[0][0], e[0][1], e[1][0], e[1][1]),
          i && at(t, i[0], i[1], e[0][0], e[0][1]),
          (i = e[1]);
      }),
      t
    );
  }
  const ht = {
    bowing: Qe,
    curveStepCount: et,
    curveTightness: Ze,
    dashGap: 0,
    dashOffset: 0,
    fill: '#000',
    fillStyle: 'hachure',
    fillWeight: 1,
    hachureAngle: -41,
    hachureGap: 5,
    maxRandomnessOffset: Je,
    roughness: Ke,
    simplification: 1,
    stroke: '#000',
    strokeWidth: 2,
    zigzagOffset: 0
  };
  function pt(e) {
    return ct(
      (function(e, t) {
        const i = [];
        if (e && e.length) {
          let s = e[0][0],
            o = e[0][0],
            r = e[0][1],
            n = e[0][1];
          for (let t = 1; t < e.length; t++)
            (s = Math.min(s, e[t][0])),
              (o = Math.max(o, e[t][0])),
              (r = Math.min(r, e[t][1])),
              (n = Math.max(n, e[t][1]));
          const a = t.hachureAngle;
          let d = t.hachureGap;
          d < 0 && (d = 4 * t.strokeWidth), (d = Math.max(d, 0.1));
          const l = (a % 180) * (Math.PI / 180),
            c = Math.cos(l),
            h = Math.sin(l),
            p = Math.tan(l),
            u = new Ye(r - 1, n + 1, s - 1, o + 1, d, h, c, p);
          let g;
          for (; null != (g = u.nextLine()); ) {
            const t = Ge(g, e);
            for (let e = 0; e < t.length; e++)
              if (e < t.length - 1) {
                const s = t[e],
                  o = t[e + 1];
                i.push([s, o]);
              }
          }
        }
        return i;
      })(e, ht)
    );
  }
  function ut(e, t, i, s) {
    return ct(
      (function(e, t, i, s, o, r) {
        const n = [];
        let a = Math.abs(s / 2),
          d = Math.abs(o / 2);
        (a += e.randOffset(0.05 * a, r)), (d += e.randOffset(0.05 * d, r));
        const l = r.hachureAngle;
        let c = r.hachureGap;
        c <= 0 && (c = 4 * r.strokeWidth);
        let h = r.fillWeight;
        h < 0 && (h = r.strokeWidth / 2);
        const p = (l % 180) * (Math.PI / 180),
          u = Math.tan(p),
          g = d / a,
          f = Math.sqrt(g * u * g * u + 1),
          m = (g * u) / f,
          b = 1 / f,
          y = c / ((a * d) / Math.sqrt(d * b * (d * b) + a * m * (a * m)) / a);
        let v = Math.sqrt(a * a - (t - a + y) * (t - a + y));
        for (let e = t - a + y; e < t + a; e += y) {
          const s = Xe(
              e,
              i - (v = Math.sqrt(a * a - (t - e) * (t - e))),
              t,
              i,
              m,
              b,
              g
            ),
            o = Xe(e, i + v, t, i, m, b, g);
          n.push([s, o]);
        }
        return n;
      })({ randOffset: (e, t) => st(-e, e) }, e, t, i, s, ht)
    );
  }
  function gt(e, t, i, s = !0, o = !0) {
    if (t) {
      const r = {
        bubbles: 'boolean' != typeof s || s,
        composed: 'boolean' != typeof o || o
      };
      i && (r.detail = i);
      const n = window.SlickCustomEvent || CustomEvent;
      e.dispatchEvent(new n(t, r));
    }
  }
  var ft = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    mt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let bt = class extends Fe {
    constructor() {
      super(),
        (this.elevation = 1),
        (this.disabled = !1),
        window.ResizeObserver &&
          (this.resizeObserver = new window.ResizeObserver(() => {
            this.svg && this.wiredRender(!0);
          }));
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          font-size: 14px;
        }
        path {
          transition: transform 0.05s ease;
        }
        button {
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          text-align: center;
          padding: 10px;
          color: inherit;
          outline: none;
        }
        button[disabled] {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        button:active path {
          transform: scale(0.97) translate(1.5%, 1.5%);
        }
        button:focus path {
          stroke-width: 1.5;
        }
        button::-moz-focus-inner {
          border: 0;
        }
      `
      ];
    }
    render() {
      return E`
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${this.wiredRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
    }
    focus() {
      this.button ? this.button.focus() : super.focus();
    }
    canvasSize() {
      if (this.button) {
        const e = this.button.getBoundingClientRect(),
          t = Math.min(Math.max(1, this.elevation), 5);
        return [e.width + 2 * (t - 1), e.height + 2 * (t - 1)];
      }
      return this.lastSize;
    }
    draw(e, t) {
      const i = Math.min(Math.max(1, this.elevation), 5),
        s = { width: t[0] - 2 * (i - 1), height: t[1] - 2 * (i - 1) };
      dt(e, 0, 0, s.width, s.height);
      for (let t = 1; t < i; t++)
        (at(
          e,
          2 * t,
          s.height + 2 * t,
          s.width + 2 * t,
          s.height + 2 * t
        ).style.opacity = `${(75 - 10 * t) / 100}`),
          (at(
            e,
            s.width + 2 * t,
            s.height + 2 * t,
            s.width + 2 * t,
            2 * t
          ).style.opacity = `${(75 - 10 * t) / 100}`),
          (at(
            e,
            2 * t,
            s.height + 2 * t,
            s.width + 2 * t,
            s.height + 2 * t
          ).style.opacity = `${(75 - 10 * t) / 100}`),
          (at(
            e,
            s.width + 2 * t,
            s.height + 2 * t,
            s.width + 2 * t,
            2 * t
          ).style.opacity = `${(75 - 10 * t) / 100}`);
    }
    updated() {
      super.updated(), this.attachResizeListener();
    }
    disconnectedCallback() {
      this.detachResizeListener();
    }
    attachResizeListener() {
      this.button &&
        this.resizeObserver &&
        this.resizeObserver.observe &&
        this.resizeObserver.observe(this.button);
    }
    detachResizeListener() {
      this.button &&
        this.resizeObserver &&
        this.resizeObserver.unobserve &&
        this.resizeObserver.unobserve(this.button);
    }
  };
  ft(
    [re({ type: Number }), mt('design:type', Object)],
    bt.prototype,
    'elevation',
    void 0
  ),
    ft(
      [re({ type: Boolean, reflect: !0 }), mt('design:type', Object)],
      bt.prototype,
      'disabled',
      void 0
    ),
    ft(
      [ne('button'), mt('design:type', HTMLButtonElement)],
      bt.prototype,
      'button',
      void 0
    ),
    (bt = ft([ie('wired-button'), mt('design:paramtypes', [])], bt));
  var yt = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    vt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let wt = class extends ge {
    constructor() {
      super(...arguments),
        (this.elevation = 3),
        (this.disabled = !1),
        (this.initials = !1),
        (this.format = e =>
          this.months_short[e.getMonth()] +
          ' ' +
          e.getDate() +
          ', ' +
          e.getFullYear()),
        (this.weekdays_short = [
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat'
        ]),
        (this.months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ]),
        (this.months_short = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]),
        (this.firstOfMonthDate = new Date()),
        (this.fDate = void 0),
        (this.lDate = void 0),
        (this.calendarRefSize = { width: 0, height: 0 }),
        (this.tblColWidth = 0),
        (this.tblRowHeight = 0),
        (this.tblHeadHeight = 0),
        (this.monthYear = ''),
        (this.weeks = [[]]);
    }
    connectedCallback() {
      super.connectedCallback(),
        this.resizeHandler ||
          ((this.resizeHandler = this.debounce(
            this.resized.bind(this),
            200,
            !1,
            this
          )),
          window.addEventListener('resize', this.resizeHandler)),
        this.localizeCalendarHeaders(),
        this.setInitialConditions(),
        this.computeCalendar(),
        this.refreshSelection(),
        setTimeout(() => this.updated());
    }
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback(),
        this.resizeHandler &&
          (window.removeEventListener('resize', this.resizeHandler),
          delete this.resizeHandler);
    }
    static get styles() {
      return pe`
    :host {
      display: inline-block;
      font-family: inherit;
      position: relative;
      outline: none;
      opacity: 0;
    }

    :host(.wired-disabled) {
      opacity: 0.5 !important;
      cursor: default;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.02);
    }

    :host(.wired-rendered) {
      opacity: 1;
    }

    :host(:focus) path {
      stroke-width: 1.5;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    svg {
      display: block;
    }

    .calendar path {
      stroke: var(--wired-calendar-color, black);
      stroke-width: 0.7;
      fill: transparent;
    }

    .selected path {
      stroke: var(--wired-calendar-selected-color, red);
      stroke-width: 2.5;
      fill: transparent;
      transition: transform 0.05s ease;
    }

    table {
      position: relative;
      background: var(--wired-calendar-bg, white);
      border-collapse: collapse;
      font-size: inherit;
      text-transform: capitalize;
      line-height: unset;
      cursor: default;
      overflow: hidden;
    }

    table:focus {
      outline: none !important;
    }

    td,
    th {
      border-radius: 4px;
      text-align: center;
    }

    td.disabled {
      color: var(--wired-calendar-disabled-color, lightgray);
      cursor: not-allowed;
    }

    td.dimmed {
      color: var(--wired-calendar-dimmed-color, gray);
    }

    td.selected {
      position: absolute;
    }

    td:not(.disabled):not(.selected):hover {
      background-color: #d0d0d0;
      cursor: pointer;
    }

    .pointer {
      cursor: pointer;
    }

    `;
    }
    render() {
      return E`
    <table style="width:${this.calendarRefSize.width}px;height:${
        this.calendarRefSize.height
      }px;border:${8}px solid transparent"
            @mousedown="${this.onItemClick}"
            @touchstart="${this.onItemClick}">
      ${''}
      <tr class="top-header" style="height:${this.tblHeadHeight}px;">
        <th id="prevCal" class="pointer" @click="${this.onPrevClick}"><<</th>
        <th colSpan="5">${this.monthYear}</th>
        <th id="nextCal" class="pointer" @click="${this.onNextClick}">>></th>
      </tr>
      ${''}
      <tr class="header" style="height:${this.tblHeadHeight}px;">
        ${this.weekdays_short.map(
          e => E`<th style="width: ${this.tblColWidth};">${
            this.initials ? e[0] : e
          }</th>
            `
        )}
      </tr>
      ${''}
      ${this.weeks.map(
        e => E`<tr style="height:${this.tblRowHeight}px;">
              ${''}
              ${e.map(
                e => E`${
                  e.selected
                    ? E`
                            <td class="selected" value="${e.value}">
                            <div style="width: ${this.tblColWidth}px; line-height:${this.tblRowHeight}px;">${e.text}</div>
                            <div class="overlay">
                              <svg id="svgTD" class="selected"></svg>
                            </div></td>
                        `
                    : E`
                            <td .className="${
                              e.disabled ? 'disabled' : e.dimmed ? 'dimmed' : ''
                            }"
                                value="${e.disabled ? '' : e.value}">${
                        e.text
                      }</td>
                        `
                }
                    `
              )}${''}
            </tr>`
      )}${''}
    </table>
    <div class="overlay">
      <svg id="svg" class="calendar"></svg>
    </div>
    `;
    }
    firstUpdated() {
      this.setAttribute('role', 'dialog');
    }
    updated(e) {
      e &&
        e instanceof Map &&
        (e.has('disabled') && this.refreshDisabledState(),
        e.has('selected') && this.refreshSelection());
      const t = this.shadowRoot.getElementById('svg');
      for (; t.hasChildNodes(); ) t.removeChild(t.lastChild);
      const i = this.getCalendarSize(),
        s = Math.min(Math.max(1, this.elevation), 5),
        o = i.width + 2 * (s - 1),
        r = i.height + 2 * (s - 1);
      t.setAttribute('width', `${o}`),
        t.setAttribute('height', `${r}`),
        dt(t, 2, 2, i.width - 4, i.height - 4);
      for (let e = 1; e < s; e++)
        (at(
          t,
          2 * e,
          i.height - 4 + 2 * e,
          i.width - 4 + 2 * e,
          i.height - 4 + 2 * e
        ).style.opacity = `${(85 - 10 * e) / 100}`),
          (at(
            t,
            i.width - 4 + 2 * e,
            i.height - 4 + 2 * e,
            i.width - 4 + 2 * e,
            2 * e
          ).style.opacity = `${(85 - 10 * e) / 100}`),
          (at(
            t,
            2 * e,
            i.height - 4 + 2 * e,
            i.width - 4 + 2 * e,
            i.height - 4 + 2 * e
          ).style.opacity = `${(85 - 10 * e) / 100}`),
          (at(
            t,
            i.width - 4 + 2 * e,
            i.height - 4 + 2 * e,
            i.width - 4 + 2 * e,
            2 * e
          ).style.opacity = `${(85 - 10 * e) / 100}`);
      const n = this.shadowRoot.getElementById('svgTD');
      if (n) {
        for (; n.hasChildNodes(); ) n.removeChild(n.lastChild);
        const e = Math.max(1 * this.tblColWidth, 20),
          t = Math.max(0.9 * this.tblRowHeight, 18),
          i = lt(n, this.tblColWidth / 2, this.tblRowHeight / 2, e, t);
        n.appendChild(i);
      }
      this.classList.add('wired-rendered');
    }
    setSelectedDate(e) {
      if (((this.selected = e), this.selected)) {
        const e = new Date(this.selected);
        (this.firstOfMonthDate = new Date(e.getFullYear(), e.getMonth(), 1)),
          this.computeCalendar(),
          this.requestUpdate(),
          this.fireSelected();
      }
    }
    localizeCalendarHeaders() {
      if (!this.locale) {
        const e = navigator;
        e.hasOwnProperty('systemLanguage')
          ? (this.locale = e.systemLanguage)
          : e.hasOwnProperty('browserLanguage')
          ? (this.locale = e.browserLanguage)
          : (this.locale = (navigator.languages || ['en'])[0]);
      }
      const e = (this.locale || '').toLowerCase();
      if ('en-us' !== e && 'en' !== e) {
        const e = new Date(),
          t = e.getUTCDay(),
          i = new Date(e.getTime() - 864e5 * t),
          s = new Date(i);
        for (let e = 0; e < 7; e++)
          s.setDate(i.getDate() + e),
            (this.weekdays_short[e] = s.toLocaleString(this.locale, {
              weekday: 'short'
            }));
        e.setDate(1);
        for (let t = 0; t < 12; t++)
          e.setMonth(t),
            (this.months[t] = e.toLocaleString(this.locale, { month: 'long' }));
      }
    }
    setInitialConditions() {
      let e;
      (this.calendarRefSize = this.getCalendarSize()),
        this.selected
          ? ((e = new Date(this.selected)),
            (this.value = {
              date: new Date(this.selected),
              text: this.selected
            }))
          : (e = new Date()),
        (this.firstOfMonthDate = new Date(e.getFullYear(), e.getMonth(), 1)),
        this.firstdate && (this.fDate = new Date(this.firstdate)),
        this.lastdate && (this.lDate = new Date(this.lastdate));
    }
    refreshSelection() {
      this.weeks.forEach(e =>
        e.forEach(e => {
          e.selected = (this.selected && e.value === this.selected) || !1;
        })
      ),
        this.requestUpdate();
    }
    resized() {
      (this.calendarRefSize = this.getCalendarSize()),
        this.computeCalendar(),
        this.refreshSelection();
    }
    getCalendarSize() {
      const e = this.getBoundingClientRect();
      return {
        width: e.width > 180 ? e.width : 320,
        height: e.height > 180 ? e.height : 320
      };
    }
    computeCellsizes(e, t) {
      (this.tblColWidth = e.width / 7 - 2),
        (this.tblHeadHeight = (0.25 * e.height) / 2 - 2),
        (this.tblRowHeight = (0.75 * e.height) / t - 2);
    }
    refreshDisabledState() {
      this.disabled
        ? this.classList.add('wired-disabled')
        : this.classList.remove('wired-disabled'),
        (this.tabIndex = this.disabled
          ? -1
          : +(this.getAttribute('tabindex') || 0));
    }
    onItemClick(e) {
      e.stopPropagation();
      const t = e.target;
      t &&
        t.hasAttribute('value') &&
        '' !== t.getAttribute('value') &&
        ((this.selected = t.getAttribute('value') || void 0),
        this.refreshSelection(),
        this.fireSelected());
    }
    fireSelected() {
      this.selected &&
        ((this.value = { date: new Date(this.selected), text: this.selected }),
        gt(this, 'selected', { selected: this.selected }));
    }
    computeCalendar() {
      this.monthYear =
        this.months[this.firstOfMonthDate.getMonth()] +
        ' ' +
        this.firstOfMonthDate.getFullYear();
      const e = new Date(
        this.firstOfMonthDate.getFullYear(),
        this.firstOfMonthDate.getMonth(),
        1
      );
      let t = 0 - e.getDay();
      const i = Math.ceil(
        (new Date(
          this.firstOfMonthDate.getFullYear(),
          this.firstOfMonthDate.getMonth() + 1,
          0
        ).getDate() -
          t) /
          7
      );
      this.weeks = [];
      for (let s = 0; s < i; s++) {
        this.weeks[s] = [];
        for (let i = 0; i < 7; i++) {
          const o = new Date(e.getTime() + 864e5 * t),
            r = this.format(o);
          (this.weeks[s][i] = {
            value: r,
            text: o.getDate().toString(),
            selected: r === this.selected,
            dimmed: o.getMonth() !== e.getMonth(),
            disabled: this.isDateOutOfRange(o)
          }),
            t++;
        }
      }
      this.computeCellsizes(this.calendarRefSize, i);
    }
    onPrevClick() {
      (void 0 !== this.fDate &&
        new Date(
          this.fDate.getFullYear(),
          this.fDate.getMonth() - 1,
          1
        ).getMonth() ===
          new Date(
            this.firstOfMonthDate.getFullYear(),
            this.firstOfMonthDate.getMonth() - 1,
            1
          ).getMonth()) ||
        ((this.firstOfMonthDate = new Date(
          this.firstOfMonthDate.getFullYear(),
          this.firstOfMonthDate.getMonth() - 1,
          1
        )),
        this.computeCalendar(),
        this.refreshSelection());
    }
    onNextClick() {
      (void 0 !== this.lDate &&
        new Date(
          this.lDate.getFullYear(),
          this.lDate.getMonth() + 1,
          1
        ).getMonth() ===
          new Date(
            this.firstOfMonthDate.getFullYear(),
            this.firstOfMonthDate.getMonth() + 1,
            1
          ).getMonth()) ||
        ((this.firstOfMonthDate = new Date(
          this.firstOfMonthDate.getFullYear(),
          this.firstOfMonthDate.getMonth() + 1,
          1
        )),
        this.computeCalendar(),
        this.refreshSelection());
    }
    isDateOutOfRange(e) {
      return this.fDate && this.lDate
        ? e < this.fDate || this.lDate < e
        : this.fDate
        ? e < this.fDate
        : !!this.lDate && this.lDate < e;
    }
    debounce(e, t, i, s) {
      let o = 0;
      return () => {
        const r = arguments,
          n = i && !o;
        clearTimeout(o),
          (o = window.setTimeout(() => {
            (o = 0), i || e.apply(s, r);
          }, t)),
          n && e.apply(s, r);
      };
    }
  };
  yt(
    [re({ type: Number }), vt('design:type', Object)],
    wt.prototype,
    'elevation',
    void 0
  ),
    yt(
      [re({ type: String }), vt('design:type', String)],
      wt.prototype,
      'selected',
      void 0
    ),
    yt(
      [re({ type: String }), vt('design:type', String)],
      wt.prototype,
      'firstdate',
      void 0
    ),
    yt(
      [re({ type: String }), vt('design:type', String)],
      wt.prototype,
      'lastdate',
      void 0
    ),
    yt(
      [re({ type: String }), vt('design:type', String)],
      wt.prototype,
      'locale',
      void 0
    ),
    yt(
      [re({ type: Boolean, reflect: !0 }), vt('design:type', Object)],
      wt.prototype,
      'disabled',
      void 0
    ),
    yt(
      [re({ type: Boolean, reflect: !0 }), vt('design:type', Object)],
      wt.prototype,
      'initials',
      void 0
    ),
    yt(
      [re({ type: Object }), vt('design:type', Object)],
      wt.prototype,
      'value',
      void 0
    ),
    yt(
      [re({ type: Function }), vt('design:type', Function)],
      wt.prototype,
      'format',
      void 0
    ),
    (wt = yt([ie('wired-calendar')], wt));
  var xt = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    kt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Rt = class extends Fe {
    constructor() {
      super(),
        (this.elevation = 1),
        window.ResizeObserver &&
          (this.resizeObserver = new window.ResizeObserver(() => {
            this.svg && this.wiredRender();
          }));
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
        .cardFill path {
          stroke-width: 3.5;
          stroke: var(--wired-card-background-fill);
        }
        path {
          stroke: var(--wired-card-background-fill, currentColor);
        }
      `
      ];
    }
    render() {
      return E`
    <div id="overlay"><svg></svg></div>
    <div style="position: relative;">
      <slot @slotchange="${this.wiredRender}"></slot>
    </div>
    `;
    }
    updated(e) {
      const t = e.has('fill');
      this.wiredRender(t), this.attachResizeListener();
    }
    disconnectedCallback() {
      this.detachResizeListener();
    }
    attachResizeListener() {
      this.resizeObserver && this.resizeObserver.observe
        ? this.resizeObserver.observe(this)
        : this.windowResizeHandler ||
          ((this.windowResizeHandler = () => this.wiredRender()),
          window.addEventListener('resize', this.windowResizeHandler, {
            passive: !0
          }));
    }
    detachResizeListener() {
      this.resizeObserver &&
        this.resizeObserver.unobserve &&
        this.resizeObserver.unobserve(this),
        this.windowResizeHandler &&
          window.removeEventListener('resize', this.windowResizeHandler);
    }
    canvasSize() {
      const e = this.getBoundingClientRect(),
        t = Math.min(Math.max(1, this.elevation), 5);
      return [e.width + 2 * (t - 1), e.height + 2 * (t - 1)];
    }
    draw(e, t) {
      const i = Math.min(Math.max(1, this.elevation), 5),
        s = t[0] - 2 * (i - 1),
        o = t[1] - 2 * (i - 1);
      if (this.fill && this.fill.trim()) {
        const t = pt([
          [2, 2],
          [s - 4, 2],
          [s - 2, o - 4],
          [2, o - 4]
        ]);
        t.classList.add('cardFill'),
          e.style.setProperty('--wired-card-background-fill', this.fill.trim()),
          e.appendChild(t);
      }
      dt(e, 2, 2, s - 4, o - 4);
      for (let t = 1; t < i; t++)
        (at(
          e,
          2 * t,
          o - 4 + 2 * t,
          s - 4 + 2 * t,
          o - 4 + 2 * t
        ).style.opacity = `${(85 - 10 * t) / 100}`),
          (at(
            e,
            s - 4 + 2 * t,
            o - 4 + 2 * t,
            s - 4 + 2 * t,
            2 * t
          ).style.opacity = `${(85 - 10 * t) / 100}`),
          (at(
            e,
            2 * t,
            o - 4 + 2 * t,
            s - 4 + 2 * t,
            o - 4 + 2 * t
          ).style.opacity = `${(85 - 10 * t) / 100}`),
          (at(
            e,
            s - 4 + 2 * t,
            o - 4 + 2 * t,
            s - 4 + 2 * t,
            2 * t
          ).style.opacity = `${(85 - 10 * t) / 100}`);
    }
  };
  xt(
    [re({ type: Number }), kt('design:type', Object)],
    Rt.prototype,
    'elevation',
    void 0
  ),
    xt(
      [re({ type: String }), kt('design:type', String)],
      Rt.prototype,
      'fill',
      void 0
    ),
    (Rt = xt([ie('wired-card'), kt('design:paramtypes', [])], Rt));
  var St = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Ot = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Ct = class extends Fe {
    constructor() {
      super(...arguments),
        (this.checked = !1),
        (this.disabled = !1),
        (this.focused = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
      :host {
        display: inline-block;
        font-family: inherit;
      }
      :host([disabled]) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }

      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: var(--wired-checkbox-icon-color, currentColor);
        stroke-width: var(--wired-checkbox-default-swidth, 0.7);
      }
      g path {
        stroke-width: 2.5;
      }
      #container.focused {
        --wired-checkbox-default-swidth: 1.5;
      }
      `
      ];
    }
    focus() {
      this.input ? this.input.focus() : super.focus();
    }
    wiredRender(e = !1) {
      super.wiredRender(e), this.refreshCheckVisibility();
    }
    render() {
      return E`
    <label id="container" class="${this.focused ? 'focused' : ''}">
      <input type="checkbox" .checked="${this.checked}" ?disabled="${
        this.disabled
      }"
        @change="${this.onChange}"
        @focus="${() => (this.focused = !0)}"
        @blur="${() => (this.focused = !1)}">
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </label>
    `;
    }
    onChange() {
      (this.checked = this.input.checked),
        this.refreshCheckVisibility(),
        gt(this, 'change', { checked: this.checked });
    }
    canvasSize() {
      return [24, 24];
    }
    draw(e, t) {
      dt(e, 0, 0, t[0], t[1]),
        (this.svgCheck = it('g')),
        e.appendChild(this.svgCheck),
        at(this.svgCheck, 0.3 * t[0], 0.4 * t[1], 0.5 * t[0], 0.7 * t[1]),
        at(this.svgCheck, 0.5 * t[0], 0.7 * t[1], t[0] + 5, -5);
    }
    refreshCheckVisibility() {
      this.svgCheck &&
        (this.svgCheck.style.display = this.checked ? '' : 'none');
    }
  };
  St(
    [re({ type: Boolean }), Ot('design:type', Object)],
    Ct.prototype,
    'checked',
    void 0
  ),
    St(
      [re({ type: Boolean, reflect: !0 }), Ot('design:type', Object)],
      Ct.prototype,
      'disabled',
      void 0
    ),
    St([re(), Ot('design:type', Object)], Ct.prototype, 'focused', void 0),
    St(
      [ne('input'), Ot('design:type', HTMLInputElement)],
      Ct.prototype,
      'input',
      void 0
    ),
    (Ct = St([ie('wired-checkbox')], Ct));
  var zt = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    jt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let _t = class extends ge {
    constructor() {
      super(...arguments),
        (this.disabled = !1),
        (this.cardShowing = !1),
        (this.itemNodes = []);
    }
    static get styles() {
      return pe`
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        outline: none;
        opacity: 0;
      }

      :host(.wired-disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }

      :host(.wired-rendered) {
        opacity: 1;
      }

      :host(:focus) path {
        stroke-width: 1.5;
      }

      #container {
        white-space: nowrap;
        position: relative;
      }

      .inline {
        display: inline-block;
        vertical-align: top
      }

      #textPanel {
        min-width: 90px;
        min-height: 18px;
        padding: 8px;
      }

      #dropPanel {
        width: 34px;
        cursor: pointer;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      svg {
        display: block;
      }

      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }

      #card {
        display: block;
        position: absolute;
        background: var(--wired-combo-popup-bg, white);
        z-index: 1;
        box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
        padding: 8px;
      }

      ::slotted(wired-item) {
        display: block;
      }
    `;
    }
    render() {
      return E`
    <div id="container" @click="${this.onCombo}">
      <div id="textPanel" class="inline">
        <span>${this.value && this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg></svg>
      </div>
    </div>
    <wired-card id="card" tabindex="-1" role="listbox" @mousedown="${
      this.onItemClick
    }" @touchstart="${this.onItemClick}" style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `;
    }
    refreshDisabledState() {
      this.disabled
        ? this.classList.add('wired-disabled')
        : this.classList.remove('wired-disabled'),
        (this.tabIndex = this.disabled
          ? -1
          : +(this.getAttribute('tabindex') || 0));
    }
    firstUpdated() {
      this.setAttribute('role', 'combobox'),
        this.setAttribute('aria-haspopup', 'listbox'),
        this.refreshSelection(),
        this.addEventListener('blur', () => {
          this.cardShowing && this.setCardShowing(!1);
        }),
        this.addEventListener('keydown', e => {
          switch (e.keyCode) {
            case 37:
            case 38:
              e.preventDefault(), this.selectPrevious();
              break;
            case 39:
            case 40:
              e.preventDefault(), this.selectNext();
              break;
            case 27:
              e.preventDefault(), this.cardShowing && this.setCardShowing(!1);
              break;
            case 13:
              e.preventDefault(), this.setCardShowing(!this.cardShowing);
              break;
            case 32:
              e.preventDefault(), this.cardShowing || this.setCardShowing(!0);
          }
        });
    }
    updated(e) {
      e.has('disabled') && this.refreshDisabledState();
      const t = this.svg;
      for (; t.hasChildNodes(); ) t.removeChild(t.lastChild);
      const i = this.shadowRoot
        .getElementById('container')
        .getBoundingClientRect();
      t.setAttribute('width', `${i.width}`),
        t.setAttribute('height', `${i.height}`);
      const s = this.shadowRoot
        .getElementById('textPanel')
        .getBoundingClientRect();
      (this.shadowRoot.getElementById('dropPanel').style.minHeight =
        s.height + 'px'),
        dt(t, 0, 0, s.width, s.height);
      const o = s.width - 4;
      dt(t, o, 0, 34, s.height);
      const r = Math.max(0, Math.abs((s.height - 24) / 2)),
        n = (function(e, t) {
          let i;
          const s = t.length;
          if (s > 2)
            for (let e = 0; e < 2; e++) {
              let o = !0;
              for (let e = 1; e < s; e++)
                (i = rt(
                  t[e - 1][0],
                  t[e - 1][1],
                  t[e][0],
                  t[e][1],
                  o,
                  e > 0,
                  i
                )),
                  (o = !1);
              i = rt(t[s - 1][0], t[s - 1][1], t[0][0], t[0][1], o, e > 0, i);
            }
          else i = 2 === s ? ot(t[0][0], t[0][1], t[1][0], t[1][1]) : new tt();
          const o = it('path', { d: i.value });
          return e.appendChild(o), o;
        })(t, [
          [o + 8, 5 + r],
          [o + 26, 5 + r],
          [o + 17, r + Math.min(s.height, 18)]
        ]);
      if (
        ((n.style.fill = 'currentColor'),
        (n.style.pointerEvents = this.disabled ? 'none' : 'auto'),
        (n.style.cursor = 'pointer'),
        this.classList.add('wired-rendered'),
        this.setAttribute('aria-expanded', `${this.cardShowing}`),
        !this.itemNodes.length)
      ) {
        this.itemNodes = [];
        const e = this.shadowRoot.getElementById('slot').assignedNodes();
        if (e && e.length)
          for (let t = 0; t < e.length; t++) {
            const i = e[t];
            'WIRED-ITEM' === i.tagName &&
              (i.setAttribute('role', 'option'), this.itemNodes.push(i));
          }
      }
    }
    refreshSelection() {
      this.lastSelectedItem &&
        ((this.lastSelectedItem.selected = !1),
        this.lastSelectedItem.removeAttribute('aria-selected'));
      const e = this.shadowRoot.getElementById('slot').assignedNodes();
      if (e) {
        let t = null;
        for (let i = 0; i < e.length; i++) {
          const s = e[i];
          if ('WIRED-ITEM' === s.tagName) {
            const e = s.value || s.getAttribute('value') || '';
            if (this.selected && e === this.selected) {
              t = s;
              break;
            }
          }
        }
        (this.lastSelectedItem = t || void 0),
          this.lastSelectedItem &&
            ((this.lastSelectedItem.selected = !0),
            this.lastSelectedItem.setAttribute('aria-selected', 'true')),
          (this.value = t
            ? { value: t.value || '', text: t.textContent || '' }
            : void 0);
      }
    }
    setCardShowing(e) {
      this.card &&
        ((this.cardShowing = e),
        (this.card.style.display = e ? '' : 'none'),
        e &&
          setTimeout(() => {
            this.shadowRoot
              .getElementById('slot')
              .assignedNodes()
              .filter(e => e.nodeType === Node.ELEMENT_NODE)
              .forEach(e => {
                const t = e;
                t.requestUpdate && t.requestUpdate();
              });
          }, 10),
        this.setAttribute('aria-expanded', `${this.cardShowing}`));
    }
    onItemClick(e) {
      e.stopPropagation(),
        (this.selected = e.target.value),
        this.refreshSelection(),
        this.fireSelected(),
        setTimeout(() => {
          this.setCardShowing(!1);
        });
    }
    fireSelected() {
      gt(this, 'selected', { selected: this.selected });
    }
    selectPrevious() {
      const e = this.itemNodes;
      if (e.length) {
        let t = -1;
        for (let i = 0; i < e.length; i++)
          if (e[i] === this.lastSelectedItem) {
            t = i;
            break;
          }
        t < 0 ? (t = 0) : 0 === t ? (t = e.length - 1) : t--,
          (this.selected = e[t].value || ''),
          this.refreshSelection(),
          this.fireSelected();
      }
    }
    selectNext() {
      const e = this.itemNodes;
      if (e.length) {
        let t = -1;
        for (let i = 0; i < e.length; i++)
          if (e[i] === this.lastSelectedItem) {
            t = i;
            break;
          }
        t < 0 ? (t = 0) : t >= e.length - 1 ? (t = 0) : t++,
          (this.selected = e[t].value || ''),
          this.refreshSelection(),
          this.fireSelected();
      }
    }
    onCombo(e) {
      e.stopPropagation(), this.setCardShowing(!this.cardShowing);
    }
  };
  zt(
    [re({ type: Object }), jt('design:type', Object)],
    _t.prototype,
    'value',
    void 0
  ),
    zt(
      [re({ type: String }), jt('design:type', String)],
      _t.prototype,
      'selected',
      void 0
    ),
    zt(
      [re({ type: Boolean, reflect: !0 }), jt('design:type', Object)],
      _t.prototype,
      'disabled',
      void 0
    ),
    zt(
      [ne('svg'), jt('design:type', SVGSVGElement)],
      _t.prototype,
      'svg',
      void 0
    ),
    zt(
      [ne('#card'), jt('design:type', HTMLDivElement)],
      _t.prototype,
      'card',
      void 0
    ),
    (_t = zt([ie('wired-combo')], _t));
  var Mt = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    $t = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Pt = class extends ge {
    constructor() {
      super(...arguments), (this.elevation = 5), (this.open = !1);
    }
    static get styles() {
      return pe`
      #container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: var(--wired-dialog-z-index, 100);
      }
      #container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.4);
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      #overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transform: translateY(150px);
        transition: transform 0.5s ease, opacity 0.5s ease;
      }
      .layout.vertical {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
      }
      .flex {
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        flex: 1;
        -webkit-flex-basis: 0.000000001px;
        flex-basis: 0.000000001px;
      }
      wired-card {
        display: inline-block;
        background: white;
        text-align: left;
      }

      :host([open]) #container {
        pointer-events: auto;
      }
      :host([open]) #container::before {
        opacity: 1;
      }
      :host([open]) #overlay {
        opacity: 1;
        transform: none;
      }
    `;
    }
    render() {
      return E`
    <div id="container">
      <div id="overlay" class="vertical layout">
        <div class="flex"></div>
        <div style="text-align: center; padding: 5px;">
          <wired-card .elevation="${this.elevation}"><slot></slot></wired-card>
        </div>
        <div class="flex"></div>
      </div>
    </div>
    `;
    }
    updated() {
      this.card && this.card.wiredRender(!0);
    }
  };
  Mt(
    [re({ type: Number }), $t('design:type', Object)],
    Pt.prototype,
    'elevation',
    void 0
  ),
    Mt(
      [re({ type: Boolean, reflect: !0 }), $t('design:type', Object)],
      Pt.prototype,
      'open',
      void 0
    ),
    Mt([ne('wired-card'), $t('design:type', Rt)], Pt.prototype, 'card', void 0),
    (Pt = Mt([ie('wired-dialog')], Pt));
  var Nt = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Et = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Dt = class extends Fe {
    constructor() {
      super(...arguments), (this.elevation = 1);
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: block;
          position: relative;
        }
      `
      ];
    }
    render() {
      return E`<svg></svg>`;
    }
    canvasSize() {
      const e = this.getBoundingClientRect(),
        t = Math.min(Math.max(1, this.elevation), 5);
      return [e.width, 6 * t];
    }
    draw(e, t) {
      const i = Math.min(Math.max(1, this.elevation), 5);
      for (let s = 0; s < i; s++) at(e, 0, 6 * s + 3, t[0], 6 * s + 3);
    }
  };
  Nt(
    [re({ type: Number }), Et('design:type', Object)],
    Dt.prototype,
    'elevation',
    void 0
  ),
    (Dt = Nt([ie('wired-divider')], Dt));
  var At = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Lt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Tt = class extends Fe {
    constructor() {
      super(...arguments), (this.disabled = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          font-size: 14px;
          color: #fff;
        }
        button {
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          text-align: center;
          padding: 16px;
          color: inherit;
          outline: none;
          border-radius: 50%;
        }
        button[disabled] {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        button::-moz-focus-inner {
          border: 0;
        }
        button ::slotted(*) {
          position: relative;
          font-size: var(--wired-icon-size, 24px);
          transition: transform 0.2s ease, opacity 0.2s ease;
          opacity: 0.85;
        }
        path {
          stroke: var(--wired-fab-bg-color, #018786);
          stroke-width: 3;
          fill: transparent;
        }

        button:focus ::slotted(*) {
          opacity: 1;
        }
        button:active ::slotted(*) {
          opacity: 1;
          transform: scale(1.15);
        }
      `
      ];
    }
    render() {
      return E`
    <button ?disabled="${this.disabled}">
      <div id="overlay">
        <svg></svg>
      </div>
      <slot @slotchange="${this.wiredRender}"></slot>
    </button>
    `;
    }
    canvasSize() {
      if (this.button) {
        const e = this.button.getBoundingClientRect();
        return [e.width, e.height];
      }
      return this.lastSize;
    }
    draw(e, t) {
      const i = Math.min(t[0], t[1]),
        s = ut(i / 2, i / 2, i, i);
      e.appendChild(s);
    }
  };
  At(
    [re({ type: Boolean, reflect: !0 }), Lt('design:type', Object)],
    Tt.prototype,
    'disabled',
    void 0
  ),
    At(
      [ne('button'), Lt('design:type', HTMLButtonElement)],
      Tt.prototype,
      'button',
      void 0
    ),
    (Tt = At([ie('wired-fab')], Tt));
  var It = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    qt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Bt = class extends Fe {
    constructor() {
      super(...arguments), (this.disabled = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          font-size: 14px;
        }
        path {
          transition: transform 0.05s ease;
        }
        button {
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          text-align: center;
          padding: 10px;
          color: inherit;
          outline: none;
          border-radius: 50%;
        }
        button[disabled] {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        button:active path {
          transform: scale(0.97) translate(1.5%, 1.5%);
        }
        button:focus path {
          stroke-width: 1.5;
        }
        button::-moz-focus-inner {
          border: 0;
        }
        button ::slotted(*) {
          position: relative;
          font-size: var(--wired-icon-size, 24px);
        }
      `
      ];
    }
    render() {
      return E`
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${this.wiredRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
    }
    canvasSize() {
      if (this.button) {
        const e = this.button.getBoundingClientRect();
        return [e.width, e.height];
      }
      return this.lastSize;
    }
    draw(e, t) {
      const i = Math.min(t[0], t[1]);
      e.setAttribute('width', `${i}`),
        e.setAttribute('height', `${i}`),
        lt(e, i / 2, i / 2, i, i);
    }
  };
  It(
    [re({ type: Boolean, reflect: !0 }), qt('design:type', Object)],
    Bt.prototype,
    'disabled',
    void 0
  ),
    It(
      [ne('button'), qt('design:type', HTMLButtonElement)],
      Bt.prototype,
      'button',
      void 0
    ),
    (Bt = It([ie('wired-icon-button')], Bt));
  var Ht = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Vt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Ut = class extends Fe {
    constructor() {
      super(),
        (this.elevation = 1),
        (this.src =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='),
        window.ResizeObserver &&
          (this.resizeObserver = new window.ResizeObserver(() => {
            this.svg && this.wiredRender();
          }));
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
          line-height: 1;
          padding: 3px;
        }
        img {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
          max-height: 100%;
        }
        path {
          stroke-width: 1;
        }
      `
      ];
    }
    render() {
      return E`
    <img src="${this.src}" loading="lazy">
    <div id="overlay"><svg></svg></div>
    `;
    }
    updated() {
      super.updated(), this.attachResizeListener();
    }
    disconnectedCallback() {
      this.detachResizeListener();
    }
    attachResizeListener() {
      this.resizeObserver && this.resizeObserver.observe
        ? this.resizeObserver.observe(this)
        : this.windowResizeHandler ||
          ((this.windowResizeHandler = () => this.wiredRender()),
          window.addEventListener('resize', this.windowResizeHandler, {
            passive: !0
          }));
    }
    detachResizeListener() {
      this.resizeObserver &&
        this.resizeObserver.unobserve &&
        this.resizeObserver.unobserve(this),
        this.windowResizeHandler &&
          window.removeEventListener('resize', this.windowResizeHandler);
    }
    canvasSize() {
      const e = this.getBoundingClientRect(),
        t = Math.min(Math.max(1, this.elevation), 5);
      return [e.width + 2 * (t - 1), e.height + 2 * (t - 1)];
    }
    draw(e, t) {
      const i = Math.min(Math.max(1, this.elevation), 5),
        s = t[0] - 2 * (i - 1),
        o = t[1] - 2 * (i - 1);
      dt(e, 2, 2, s - 4, o - 4);
      for (let t = 1; t < i; t++)
        (at(
          e,
          2 * t,
          o - 4 + 2 * t,
          s - 4 + 2 * t,
          o - 4 + 2 * t
        ).style.opacity = `${(85 - 10 * t) / 100}`),
          (at(
            e,
            s - 4 + 2 * t,
            o - 4 + 2 * t,
            s - 4 + 2 * t,
            2 * t
          ).style.opacity = `${(85 - 10 * t) / 100}`),
          (at(
            e,
            2 * t,
            o - 4 + 2 * t,
            s - 4 + 2 * t,
            o - 4 + 2 * t
          ).style.opacity = `${(85 - 10 * t) / 100}`),
          (at(
            e,
            s - 4 + 2 * t,
            o - 4 + 2 * t,
            s - 4 + 2 * t,
            2 * t
          ).style.opacity = `${(85 - 10 * t) / 100}`);
    }
  };
  Ht(
    [re({ type: Number }), Vt('design:type', Object)],
    Ut.prototype,
    'elevation',
    void 0
  ),
    Ht(
      [re({ type: String }), Vt('design:type', String)],
      Ut.prototype,
      'src',
      void 0
    ),
    (Ut = Ht([ie('wired-image'), Vt('design:paramtypes', [])], Ut));
  var Ft = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Wt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Yt = class extends Fe {
    constructor() {
      super(...arguments),
        (this.disabled = !1),
        (this.placeholder = ''),
        (this.type = 'text'),
        (this.autocomplete = ''),
        (this.autocapitalize = ''),
        (this.autocorrect = ''),
        (this.required = !1),
        (this.autofocus = !1),
        (this.readonly = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
          padding: 5px;
          font-family: sans-serif;
          width: 150px;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          padding: 6px;
        }
      `
      ];
    }
    render() {
      return E`
    <input name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      ?required="${this.required}" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}"
      maxlength="${this.maxlength}" min="${this.min}" max="${this.max}" step="${this.step}" ?readonly="${this.readonly}"
      size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}"
      @change="${this.refire}" @input="${this.refire}">
    <div id="overlay">
      <svg></svg>
    </div>
    `;
    }
    get input() {
      return this.textInput;
    }
    get value() {
      const e = this.input;
      return (e && e.value) || '';
    }
    set value(e) {
      if (this.shadowRoot) {
        const t = this.input;
        t && (t.value = e);
      } else this.pendingValue = e;
    }
    firstUpdated() {
      (this.value =
        this.pendingValue || this.value || this.getAttribute('value') || ''),
        delete this.pendingValue;
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      dt(e, 2, 2, t[0] - 2, t[1] - 2);
    }
    refire(e) {
      e.stopPropagation(), gt(this, e.type, { sourceEvent: e });
    }
  };
  Ft(
    [re({ type: Boolean, reflect: !0 }), Wt('design:type', Object)],
    Yt.prototype,
    'disabled',
    void 0
  ),
    Ft(
      [re({ type: String }), Wt('design:type', Object)],
      Yt.prototype,
      'placeholder',
      void 0
    ),
    Ft(
      [re({ type: String }), Wt('design:type', String)],
      Yt.prototype,
      'name',
      void 0
    ),
    Ft(
      [re({ type: String }), Wt('design:type', String)],
      Yt.prototype,
      'min',
      void 0
    ),
    Ft(
      [re({ type: String }), Wt('design:type', String)],
      Yt.prototype,
      'max',
      void 0
    ),
    Ft(
      [re({ type: String }), Wt('design:type', String)],
      Yt.prototype,
      'step',
      void 0
    ),
    Ft(
      [re({ type: String }), Wt('design:type', Object)],
      Yt.prototype,
      'type',
      void 0
    ),
    Ft(
      [re({ type: String }), Wt('design:type', Object)],
      Yt.prototype,
      'autocomplete',
      void 0
    ),
    Ft(
      [re({ type: String }), Wt('design:type', Object)],
      Yt.prototype,
      'autocapitalize',
      void 0
    ),
    Ft(
      [re({ type: String }), Wt('design:type', Object)],
      Yt.prototype,
      'autocorrect',
      void 0
    ),
    Ft(
      [re({ type: Boolean }), Wt('design:type', Object)],
      Yt.prototype,
      'required',
      void 0
    ),
    Ft(
      [re({ type: Boolean }), Wt('design:type', Object)],
      Yt.prototype,
      'autofocus',
      void 0
    ),
    Ft(
      [re({ type: Boolean }), Wt('design:type', Object)],
      Yt.prototype,
      'readonly',
      void 0
    ),
    Ft(
      [re({ type: Number }), Wt('design:type', Number)],
      Yt.prototype,
      'minlength',
      void 0
    ),
    Ft(
      [re({ type: Number }), Wt('design:type', Number)],
      Yt.prototype,
      'maxlength',
      void 0
    ),
    Ft(
      [re({ type: Number }), Wt('design:type', Number)],
      Yt.prototype,
      'size',
      void 0
    ),
    Ft(
      [ne('input'), Wt('design:type', HTMLInputElement)],
      Yt.prototype,
      'textInput',
      void 0
    ),
    (Yt = Ft([ie('wired-input')], Yt));
  var Gt = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Xt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Jt = class extends Fe {
    constructor() {
      super(...arguments),
        (this.value = ''),
        (this.name = ''),
        (this.selected = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
      :host {
        display: inline-block;
        font-size: 14px;
        text-align: left;
      }
      button {
        cursor: pointer;
        outline: none;
        overflow: hidden;
        color: inherit;
        user-select: none;
        position: relative;
        font-family: inherit;
        text-align: inherit;
        font-size: inherit;
        letter-spacing: 1.25px;
        padding: 1px 10px;
        min-height: 36px;
        text-transform: inherit;
        background: none;
        border: none;
        transition: background-color 0.3s ease, color 0.3s ease;
        width: 100%;
        box-sizing: border-box;
        white-space: nowrap;
      }
      button.selected {
        color: var(--wired-item-selected-color, #fff);
      }
      button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: currentColor;
        opacity: 0;
      }
      button span {
        display: inline-block;
        transition: transform 0.2s ease;
        position: relative;
      }
      button:active span {
        transform: scale(1.02);
      }
      #overlay {
        display: none;
      }
      button.selected #overlay {
        display: block;
      }
      svg path {
        stroke: var(--wired-item-selected-bg, #000);
        stroke-width: 2.75;
        fill: transparent;
        transition: transform 0.05s ease;
      }
      @media (hover: hover) {
        button:hover::before {
          opacity: 0.05;
        }
      }
      `
      ];
    }
    render() {
      return E`
    <button class="${this.selected ? 'selected' : ''}">
      <div id="overlay"><svg></svg></div>
      <span><slot></slot></span>
    </button>`;
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      const i = pt([
        [0, 0],
        [t[0], 0],
        [t[0], t[1]],
        [0, t[1]]
      ]);
      e.appendChild(i);
    }
  };
  Gt([re(), Xt('design:type', Object)], Jt.prototype, 'value', void 0),
    Gt([re(), Xt('design:type', Object)], Jt.prototype, 'name', void 0),
    Gt(
      [re({ type: Boolean }), Xt('design:type', Object)],
      Jt.prototype,
      'selected',
      void 0
    ),
    (Jt = Gt([ie('wired-item')], Jt));
  var Kt = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Qt = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Zt = class extends Fe {
    constructor() {
      super(...arguments), (this.elevation = 1);
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
        }
        a, a:hover, a:visited {
          color: inherit;
          outline: none;
          display: inline-block;
          white-space: nowrap;
          text-decoration: none;
          border: none;
        }
        path {
          stroke: var(--wired-link-decoration-color, blue);
          stroke-opacity: 0.45;
        }
        a:focus path {
          stroke-opacity: 1;
        }
      `
      ];
    }
    render() {
      return E`
    <a href="${this.href}" target="${this.target || ''}">
      <slot></slot>
      <div id="overlay"><svg></svg></div>
    </a>
    `;
    }
    focus() {
      this.anchor ? this.anchor.focus() : super.focus();
    }
    canvasSize() {
      if (this.anchor) {
        const e = this.anchor.getBoundingClientRect(),
          t = Math.min(Math.max(1, this.elevation), 5);
        return [e.width, e.height + 2 * (t - 1)];
      }
      return this.lastSize;
    }
    draw(e, t) {
      const i = Math.min(Math.max(1, this.elevation), 5),
        s = { width: t[0], height: t[1] - 2 * (i - 1) };
      for (let t = 0; t < i; t++)
        at(e, 0, s.height + 2 * t - 2, s.width, s.height + 2 * t - 2),
          at(e, 0, s.height + 2 * t - 2, s.width, s.height + 2 * t - 2);
    }
  };
  Kt(
    [re({ type: Number }), Qt('design:type', Object)],
    Zt.prototype,
    'elevation',
    void 0
  ),
    Kt(
      [re({ type: String }), Qt('design:type', String)],
      Zt.prototype,
      'href',
      void 0
    ),
    Kt(
      [re({ type: String }), Qt('design:type', String)],
      Zt.prototype,
      'target',
      void 0
    ),
    Kt(
      [ne('a'), Qt('design:type', HTMLAnchorElement)],
      Zt.prototype,
      'anchor',
      void 0
    ),
    (Zt = Kt([ie('wired-link')], Zt));
  var ei = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    ti = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let ii = class extends Fe {
    constructor() {
      super(...arguments),
        (this.horizontal = !1),
        (this.itemNodes = []),
        (this.itemClickHandler = this.onItemClick.bind(this));
    }
    static get styles() {
      return [
        Ue,
        pe`
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        padding: 5px;
        outline: none;
      }
      :host(:focus) path {
        stroke-width: 1.5;
      }
      ::slotted(wired-item) {
        display: block;
      }
      :host(.wired-horizontal) ::slotted(wired-item) {
        display: inline-block;
      }
      `
      ];
    }
    render() {
      return E`
    <slot id="slot" @slotchange="${() => this.requestUpdate()}"></slot>
    <div id="overlay">
      <svg id="svg"></svg>
    </div>
    `;
    }
    firstUpdated() {
      this.setAttribute('role', 'listbox'),
        (this.tabIndex = +(this.getAttribute('tabindex') || 0)),
        this.refreshSelection(),
        this.addEventListener('click', this.itemClickHandler),
        this.addEventListener('keydown', e => {
          switch (e.keyCode) {
            case 37:
            case 38:
              e.preventDefault(), this.selectPrevious();
              break;
            case 39:
            case 40:
              e.preventDefault(), this.selectNext();
          }
        });
    }
    updated() {
      if (
        (super.updated(),
        this.horizontal
          ? this.classList.add('wired-horizontal')
          : this.classList.remove('wired-horizontal'),
        !this.itemNodes.length)
      ) {
        this.itemNodes = [];
        const e = this.shadowRoot.getElementById('slot').assignedNodes();
        if (e && e.length)
          for (let t = 0; t < e.length; t++) {
            const i = e[t];
            'WIRED-ITEM' === i.tagName &&
              (i.setAttribute('role', 'option'), this.itemNodes.push(i));
          }
      }
    }
    onItemClick(e) {
      e.stopPropagation(),
        (this.selected = e.target.value),
        this.refreshSelection(),
        this.fireSelected();
    }
    refreshSelection() {
      this.lastSelectedItem &&
        ((this.lastSelectedItem.selected = !1),
        this.lastSelectedItem.removeAttribute('aria-selected'));
      const e = this.shadowRoot.getElementById('slot').assignedNodes();
      if (e) {
        let t = null;
        for (let i = 0; i < e.length; i++) {
          const s = e[i];
          if ('WIRED-ITEM' === s.tagName) {
            const e = s.value || '';
            if (this.selected && e === this.selected) {
              t = s;
              break;
            }
          }
        }
        (this.lastSelectedItem = t || void 0),
          this.lastSelectedItem &&
            ((this.lastSelectedItem.selected = !0),
            this.lastSelectedItem.setAttribute('aria-selected', 'true')),
          (this.value = t
            ? { value: t.value || '', text: t.textContent || '' }
            : void 0);
      }
    }
    fireSelected() {
      gt(this, 'selected', { selected: this.selected });
    }
    selectPrevious() {
      const e = this.itemNodes;
      if (e.length) {
        let t = -1;
        for (let i = 0; i < e.length; i++)
          if (e[i] === this.lastSelectedItem) {
            t = i;
            break;
          }
        t < 0 ? (t = 0) : 0 === t ? (t = e.length - 1) : t--,
          (this.selected = e[t].value || ''),
          this.refreshSelection(),
          this.fireSelected();
      }
    }
    selectNext() {
      const e = this.itemNodes;
      if (e.length) {
        let t = -1;
        for (let i = 0; i < e.length; i++)
          if (e[i] === this.lastSelectedItem) {
            t = i;
            break;
          }
        t < 0 ? (t = 0) : t >= e.length - 1 ? (t = 0) : t++,
          (this.selected = e[t].value || ''),
          this.refreshSelection(),
          this.fireSelected();
      }
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      dt(e, 0, 0, t[0], t[1]);
    }
  };
  ei(
    [re({ type: Object }), ti('design:type', Object)],
    ii.prototype,
    'value',
    void 0
  ),
    ei(
      [re({ type: String }), ti('design:type', String)],
      ii.prototype,
      'selected',
      void 0
    ),
    ei(
      [re({ type: Boolean }), ti('design:type', Object)],
      ii.prototype,
      'horizontal',
      void 0
    ),
    (ii = ei([ie('wired-listbox')], ii));
  var si = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    oi = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let ri = class extends Fe {
    constructor() {
      super(...arguments),
        (this.value = 0),
        (this.min = 0),
        (this.max = 100),
        (this.percentage = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
      :host {
        display: inline-block;
        position: relative;
        width: 400px;
        height: 42px;
        font-family: sans-serif;
      }
      .labelContainer {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .progressLabel {
        color: var(--wired-progress-label-color, #000);
        font-size: var(--wired-progress-font-size, 14px);
        background: var(--wired-progress-label-background, rgba(255,255,255,0.9));
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 1.25px;
      }
      .progbox path {
        stroke: var(--wired-progress-color, rgba(0, 0, 200, 0.8));
        stroke-width: 2.75;
        fill: none;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
      `
      ];
    }
    render() {
      return E`
    <div id="overlay" class="overlay">
      <svg></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this.getProgressLabel()}</div>
    </div>
    `;
    }
    getProgressLabel() {
      if (this.percentage) {
        if (this.max === this.min) return '%';
        return (
          Math.floor(((this.value - this.min) / (this.max - this.min)) * 100) +
          '%'
        );
      }
      return '' + this.value;
    }
    wiredRender(e = !1) {
      super.wiredRender(e), this.refreshProgressFill();
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      dt(e, 2, 2, t[0] - 2, t[1] - 2);
    }
    refreshProgressFill() {
      if (
        (this.progBox &&
          (this.progBox.parentElement &&
            this.progBox.parentElement.removeChild(this.progBox),
          (this.progBox = void 0)),
        this.svg)
      ) {
        let e = 0;
        const t = this.getBoundingClientRect();
        if (this.max > this.min) {
          e = (this.value - this.min) / (this.max - this.min);
          const i = t.width * Math.max(0, Math.min(e, 100));
          (this.progBox = pt([
            [0, 0],
            [i, 0],
            [i, t.height],
            [0, t.height]
          ])),
            this.svg.appendChild(this.progBox),
            this.progBox.classList.add('progbox');
        }
      }
    }
  };
  si(
    [re({ type: Number }), oi('design:type', Object)],
    ri.prototype,
    'value',
    void 0
  ),
    si(
      [re({ type: Number }), oi('design:type', Object)],
      ri.prototype,
      'min',
      void 0
    ),
    si(
      [re({ type: Number }), oi('design:type', Object)],
      ri.prototype,
      'max',
      void 0
    ),
    si(
      [re({ type: Boolean }), oi('design:type', Object)],
      ri.prototype,
      'percentage',
      void 0
    ),
    (ri = si([ie('wired-progress')], ri));
  var ni = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    ai = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let di = class extends Fe {
    constructor() {
      super(...arguments),
        (this.checked = !1),
        (this.disabled = !1),
        (this.focused = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
      :host {
        display: inline-block;
        font-family: inherit;
      }
      :host([disabled]) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }

      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: var(--wired-radio-icon-color, currentColor);
        stroke-width: var(--wired-radio-default-swidth, 0.7);
      }
      g path {
        stroke-width: 0;
        fill: var(--wired-radio-icon-color, currentColor);
      }
      #container.focused {
        --wired-radio-default-swidth: 1.5;
      }
      `
      ];
    }
    focus() {
      this.input ? this.input.focus() : super.focus();
    }
    wiredRender(e = !1) {
      super.wiredRender(e), this.refreshCheckVisibility();
    }
    render() {
      return E`
    <label id="container" class="${this.focused ? 'focused' : ''}">
      <input type="checkbox" .checked="${this.checked}" ?disabled="${
        this.disabled
      }"
        @change="${this.onChange}"
        @focus="${() => (this.focused = !0)}"
        @blur="${() => (this.focused = !1)}">
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </label>
    `;
    }
    onChange() {
      (this.checked = this.input.checked),
        this.refreshCheckVisibility(),
        gt(this, 'change', { checked: this.checked });
    }
    canvasSize() {
      return [24, 24];
    }
    draw(e, t) {
      lt(e, t[0] / 2, t[1] / 2, t[0], t[1]),
        (this.svgCheck = it('g')),
        e.appendChild(this.svgCheck);
      const i = Math.max(0.6 * t[0], 5),
        s = Math.max(0.6 * t[1], 5);
      lt(this.svgCheck, t[0] / 2, t[1] / 2, i, s);
    }
    refreshCheckVisibility() {
      this.svgCheck &&
        (this.svgCheck.style.display = this.checked ? '' : 'none');
    }
  };
  ni(
    [re({ type: Boolean }), ai('design:type', Object)],
    di.prototype,
    'checked',
    void 0
  ),
    ni(
      [re({ type: Boolean, reflect: !0 }), ai('design:type', Object)],
      di.prototype,
      'disabled',
      void 0
    ),
    ni(
      [re({ type: String }), ai('design:type', String)],
      di.prototype,
      'name',
      void 0
    ),
    ni([re(), ai('design:type', Object)], di.prototype, 'focused', void 0),
    ni(
      [ne('input'), ai('design:type', HTMLInputElement)],
      di.prototype,
      'input',
      void 0
    ),
    (di = ni([ie('wired-radio')], di));
  var li = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    ci = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let hi = class extends ge {
    constructor() {
      super(...arguments),
        (this.radioNodes = []),
        (this.checkListener = this.handleChecked.bind(this));
    }
    static get styles() {
      return pe`
      :host {
        display: inline-block;
        font-family: inherit;
        outline: none;
      }
      :host ::slotted(*) {
        padding: var(--wired-radio-group-item-padding, 5px);
      }
    `;
    }
    render() {
      return E`<slot id="slot" @slotchange="${this.slotChange}"></slot>`;
    }
    connectedCallback() {
      super.connectedCallback(),
        this.addEventListener('change', this.checkListener);
    }
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback(),
        this.removeEventListener('change', this.checkListener);
    }
    handleChecked(e) {
      const t = e.detail.checked,
        i = e.target,
        s = i.name || '';
      t
        ? ((this.selected = (t && s) || ''), this.fireSelected())
        : (i.checked = !0);
    }
    slotChange() {
      this.requestUpdate();
    }
    firstUpdated() {
      this.setAttribute('role', 'radiogroup'),
        (this.tabIndex = +(this.getAttribute('tabindex') || 0)),
        this.addEventListener('keydown', e => {
          switch (e.keyCode) {
            case 37:
            case 38:
              e.preventDefault(), this.selectPrevious();
              break;
            case 39:
            case 40:
              e.preventDefault(), this.selectNext();
          }
        });
    }
    updated() {
      const e = this.shadowRoot.getElementById('slot').assignedNodes();
      if (((this.radioNodes = []), e && e.length))
        for (let t = 0; t < e.length; t++) {
          const i = e[t];
          if ('WIRED-RADIO' === i.tagName) {
            this.radioNodes.push(i);
            const e = i.name || '';
            this.selected && e === this.selected
              ? (i.checked = !0)
              : (i.checked = !1);
          }
        }
    }
    selectPrevious() {
      const e = this.radioNodes;
      if (e.length) {
        let t = null,
          i = -1;
        if (this.selected) {
          for (let t = 0; t < e.length; t++) {
            if (e[t].name === this.selected) {
              i = t;
              break;
            }
          }
          i < 0 ? (t = e[0]) : (--i < 0 && (i = e.length - 1), (t = e[i]));
        } else t = e[0];
        t && (t.focus(), (this.selected = t.name), this.fireSelected());
      }
    }
    selectNext() {
      const e = this.radioNodes;
      if (e.length) {
        let t = null,
          i = -1;
        if (this.selected) {
          for (let t = 0; t < e.length; t++) {
            if (e[t].name === this.selected) {
              i = t;
              break;
            }
          }
          i < 0 ? (t = e[0]) : (++i >= e.length && (i = 0), (t = e[i]));
        } else t = e[0];
        t && (t.focus(), (this.selected = t.name), this.fireSelected());
      }
    }
    fireSelected() {
      gt(this, 'selected', { selected: this.selected });
    }
  };
  li(
    [re({ type: String }), ci('design:type', String)],
    hi.prototype,
    'selected',
    void 0
  ),
    (hi = li([ie('wired-radio-group')], hi));
  var pi = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    ui = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let gi = class extends Fe {
    constructor() {
      super(...arguments),
        (this.disabled = !1),
        (this.placeholder = ''),
        (this.autocomplete = ''),
        (this.autocorrect = ''),
        (this.autofocus = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px 40px 10px 5px;
          font-family: sans-serif;
          width: 180px;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          padding: 6px;
        }

        input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
        input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration {
          display: none;
        }

        .thicker path {
          stroke-width: 1.5;
        }

        button {
          position: absolute;
          top: 0;
          right: 2px;
          width: 32px;
          height: 100%;
          box-sizing: border-box;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
          opacity: 0;
        }
      `
      ];
    }
    render() {
      return E`
    <input type="search" placeholder="${this.placeholder}" ?disabled="${
        this.disabled
      }"
      autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}"
      autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}"
      @change="${this.refire}" @input="${this.refire}">
    <div id="overlay">
      <svg></svg>
    </div>
    <button @click="${() => (this.value = '')}"></button>
    `;
    }
    get input() {
      return this.textInput;
    }
    get value() {
      const e = this.input;
      return (e && e.value) || '';
    }
    set value(e) {
      if (this.shadowRoot) {
        const t = this.input;
        t && (t.value = e), this.refreshIconState();
      } else this.pendingValue = e;
    }
    wiredRender(e = !1) {
      super.wiredRender(e), this.refreshIconState();
    }
    firstUpdated() {
      (this.value =
        this.pendingValue || this.value || this.getAttribute('value') || ''),
        delete this.pendingValue;
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      dt(e, 2, 2, t[0] - 2, t[1] - 2),
        (this.searchIcon = it('g')),
        this.searchIcon.classList.add('thicker'),
        e.appendChild(this.searchIcon),
        lt(this.searchIcon, t[0] - 30, (t[1] - 30) / 2 + 10, 20, 20),
        at(
          this.searchIcon,
          t[0] - 10,
          (t[1] - 30) / 2 + 30,
          t[0] - 25,
          (t[1] - 30) / 2 + 15
        ),
        (this.closeIcon = it('g')),
        this.closeIcon.classList.add('thicker'),
        e.appendChild(this.closeIcon),
        at(
          this.closeIcon,
          t[0] - 33,
          (t[1] - 30) / 2 + 2,
          t[0] - 7,
          (t[1] - 30) / 2 + 28
        ),
        at(
          this.closeIcon,
          t[0] - 7,
          (t[1] - 30) / 2 + 2,
          t[0] - 33,
          (t[1] - 30) / 2 + 28
        );
    }
    refreshIconState() {
      this.searchIcon &&
        this.closeIcon &&
        ((this.searchIcon.style.display = this.value.trim() ? 'none' : ''),
        (this.closeIcon.style.display = this.value.trim() ? '' : 'none'));
    }
    refire(e) {
      this.refreshIconState(),
        e.stopPropagation(),
        gt(this, e.type, { sourceEvent: e });
    }
  };
  pi(
    [re({ type: Boolean, reflect: !0 }), ui('design:type', Object)],
    gi.prototype,
    'disabled',
    void 0
  ),
    pi(
      [re({ type: String }), ui('design:type', Object)],
      gi.prototype,
      'placeholder',
      void 0
    ),
    pi(
      [re({ type: String }), ui('design:type', Object)],
      gi.prototype,
      'autocomplete',
      void 0
    ),
    pi(
      [re({ type: String }), ui('design:type', Object)],
      gi.prototype,
      'autocorrect',
      void 0
    ),
    pi(
      [re({ type: Boolean }), ui('design:type', Object)],
      gi.prototype,
      'autofocus',
      void 0
    ),
    pi(
      [ne('input'), ui('design:type', HTMLInputElement)],
      gi.prototype,
      'textInput',
      void 0
    ),
    (gi = pi([ie('wired-search-input')], gi));
  var fi = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    mi = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let bi = class extends Fe {
    constructor() {
      super(...arguments),
        (this.min = 0),
        (this.max = 100),
        (this.step = 1),
        (this.disabled = !1),
        (this.canvasWidth = 300);
    }
    static get styles() {
      return [
        Ue,
        pe`
      :host {
        display: inline-block;
        position: relative;
        width: 300px;
        box-sizing: border-box;
      }
      :host([disabled]) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 5px;
      }
      input[type=range] {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        margin: 0;
        -webkit-appearance: none;
        background: transparent;
        outline: none;
        position: relative;
      }
      input[type=range]:focus {
        outline: none;
      }
      input[type=range]::-ms-track {
        width: 100%;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
      input[type=range]::-moz-focus-outer {
        outline: none;
        border: 0;
      }
      input[type=range]::-moz-range-thumb {
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        margin: 0;
        height: 20px;
        width: 20px;
        line-height: 1;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        height: 20px;
        width: 20px;
        margin: 0;
        line-height: 1;
      }
      .knob{
        fill: var(--wired-slider-knob-color, rgb(51, 103, 214));
        stroke: var(--wired-slider-knob-color, rgb(51, 103, 214));
      }
      .bar {
        stroke: var(--wired-slider-bar-color, rgb(0, 0, 0));
      }
      input:focus + div svg .knob {
        stroke: var(--wired-slider-knob-outline-color, #000);
        fill-opacity: 0.8;
      }
      `
      ];
    }
    get value() {
      return this.input ? +this.input.value : this.min;
    }
    set value(e) {
      this.input ? (this.input.value = `${e}`) : (this.pendingValue = e),
        this.updateThumbPosition();
    }
    firstUpdated() {
      (this.value =
        this.pendingValue ||
        this.value ||
        +(this.getAttribute('value') || this.min)),
        delete this.pendingValue;
    }
    render() {
      return E`
    <div id="container">
      <input type="range"
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
        ?disabled="${this.disabled}"
        @input="${this.onInput}">
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    `;
    }
    focus() {
      this.input ? this.input.focus() : super.focus();
    }
    onInput(e) {
      e.stopPropagation(),
        this.updateThumbPosition(),
        this.input && gt(this, 'change', { value: +this.input.value });
    }
    wiredRender(e = !1) {
      super.wiredRender(e), this.updateThumbPosition();
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      this.canvasWidth = t[0];
      const i = Math.round(t[1] / 2);
      at(e, 0, i, t[0], i).classList.add('bar'),
        (this.knob = lt(e, 10, i, 20, 20)),
        this.knob.classList.add('knob');
    }
    updateThumbPosition() {
      if (this.input) {
        const e = +this.input.value,
          t = Math.max(this.step, this.max - this.min),
          i = (e - this.min) / t;
        this.knob &&
          (this.knob.style.transform = `translateX(${i *
            (this.canvasWidth - 20)}px)`);
      }
    }
  };
  fi(
    [re({ type: Number }), mi('design:type', Object)],
    bi.prototype,
    'min',
    void 0
  ),
    fi(
      [re({ type: Number }), mi('design:type', Object)],
      bi.prototype,
      'max',
      void 0
    ),
    fi(
      [re({ type: Number }), mi('design:type', Object)],
      bi.prototype,
      'step',
      void 0
    ),
    fi(
      [re({ type: Boolean, reflect: !0 }), mi('design:type', Object)],
      bi.prototype,
      'disabled',
      void 0
    ),
    fi(
      [ne('input'), mi('design:type', HTMLInputElement)],
      bi.prototype,
      'input',
      void 0
    ),
    (bi = fi([ie('wired-slider')], bi));
  var yi = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    vi = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let wi = class extends Fe {
    constructor() {
      super(...arguments),
        (this.spinning = !1),
        (this.duration = 1500),
        (this.value = 0),
        (this.timerstart = 0),
        (this.frame = 0);
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
        }
        path {
          stroke: currentColor;
          stroke-opacity: 0.65;
          stroke-width: 1.5;
          fill: none;
        }
        .knob {
          stroke-width: 2.8 !important;
          stroke-opacity: 1;
        }
      `
      ];
    }
    render() {
      return E`<svg></svg>`;
    }
    canvasSize() {
      return [76, 76];
    }
    draw(e, t) {
      lt(e, t[0] / 2, t[1] / 2, Math.floor(0.8 * t[0]), Math.floor(0.8 * t[1])),
        (this.knob = ut(0, 0, 20, 20)),
        this.knob.classList.add('knob'),
        e.appendChild(this.knob),
        this.updateCursor();
    }
    updateCursor() {
      if (this.knob) {
        const e = [
          Math.round(38 + 25 * Math.cos(this.value * Math.PI * 2)),
          Math.round(38 + 25 * Math.sin(this.value * Math.PI * 2))
        ];
        this.knob.style.transform = `translate3d(${e[0]}px, ${
          e[1]
        }px, 0) rotateZ(${Math.round(360 * this.value * 2)}deg)`;
      }
    }
    updated() {
      super.updated(), this.spinning ? this.startSpinner() : this.stopSpinner();
    }
    startSpinner() {
      this.stopSpinner(),
        (this.value = 0),
        (this.timerstart = 0),
        this.nextTick();
    }
    stopSpinner() {
      this.frame && (window.cancelAnimationFrame(this.frame), (this.frame = 0));
    }
    nextTick() {
      this.frame = window.requestAnimationFrame(e => this.tick(e));
    }
    tick(e) {
      this.spinning
        ? (this.timerstart || (this.timerstart = e),
          (this.value = Math.min(1, (e - this.timerstart) / this.duration)),
          this.updateCursor(),
          this.value >= 1 && ((this.value = 0), (this.timerstart = 0)),
          this.nextTick())
        : (this.frame = 0);
    }
  };
  yi(
    [re({ type: Boolean }), vi('design:type', Object)],
    wi.prototype,
    'spinning',
    void 0
  ),
    yi(
      [re({ type: Number }), vi('design:type', Object)],
      wi.prototype,
      'duration',
      void 0
    ),
    (wi = yi([ie('wired-spinner')], wi));
  var xi = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    ki = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Ri = class extends Fe {
    constructor() {
      super(),
        (this.name = ''),
        (this.label = ''),
        window.ResizeObserver &&
          (this.resizeObserver = new window.ResizeObserver(() => {
            this.svg && this.wiredRender();
          }));
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
      `
      ];
    }
    render() {
      return E`
    <div>
      <slot @slotchange="${this.wiredRender}"></slot>
    </div>
    <div id="overlay"><svg></svg></div>
    `;
    }
    updated() {
      super.updated(), this.attachResizeListener();
    }
    disconnectedCallback() {
      this.detachResizeListener();
    }
    attachResizeListener() {
      this.resizeObserver && this.resizeObserver.observe
        ? this.resizeObserver.observe(this)
        : this.windowResizeHandler ||
          ((this.windowResizeHandler = () => this.wiredRender()),
          window.addEventListener('resize', this.windowResizeHandler, {
            passive: !0
          }));
    }
    detachResizeListener() {
      this.resizeObserver &&
        this.resizeObserver.unobserve &&
        this.resizeObserver.unobserve(this),
        this.windowResizeHandler &&
          window.removeEventListener('resize', this.windowResizeHandler);
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      dt(e, 2, 2, t[0] - 4, t[1] - 4);
    }
  };
  xi(
    [re({ type: String }), ki('design:type', Object)],
    Ri.prototype,
    'name',
    void 0
  ),
    xi(
      [re({ type: String }), ki('design:type', Object)],
      Ri.prototype,
      'label',
      void 0
    ),
    (Ri = xi([ie('wired-tab'), ki('design:paramtypes', [])], Ri));
  var Si = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Oi = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Ci = class extends ge {
    constructor() {
      super(...arguments), (this.pages = []), (this.pageMap = new Map());
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: block;
          opacity: 1;
        }
        ::slotted(.hidden) {
          display: none !important;
        }

        :host ::slotted(.hidden) {
          display: none !important;
        }
        #bar {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
        }
      `
      ];
    }
    render() {
      return E`
    <div id="bar">
      ${Se(
        this.pages,
        e => e.name,
        e => E`
      <wired-item role="tab" .value="${e.name}" .selected="${e.name ===
          this.selected}" ?aria-selected="${e.name === this.selected}"
        @click="${() => (this.selected = e.name)}">${e.label ||
          e.name}</wired-item>
      `
      )}
    </div>
    <div>
      <slot @slotchange="${this.mapPages}"></slot>
    </div>
    `;
    }
    mapPages() {
      if (((this.pages = []), this.pageMap.clear(), this.slotElement)) {
        const e = this.slotElement.assignedNodes();
        if (e && e.length) {
          for (let t = 0; t < e.length; t++) {
            const i = e[t];
            if (
              i.nodeType === Node.ELEMENT_NODE &&
              'wired-tab' === i.tagName.toLowerCase()
            ) {
              const e = i;
              this.pages.push(e);
              const t = e.getAttribute('name') || '';
              t &&
                t
                  .trim()
                  .split(' ')
                  .forEach(t => {
                    t && this.pageMap.set(t, e);
                  });
            }
          }
          this.selected ||
            (this.pages.length && (this.selected = this.pages[0].name)),
            this.requestUpdate();
        }
      }
    }
    firstUpdated() {
      this.mapPages(),
        (this.tabIndex = +(this.getAttribute('tabindex') || 0)),
        this.addEventListener('keydown', e => {
          switch (e.keyCode) {
            case 37:
            case 38:
              e.preventDefault(), this.selectPrevious();
              break;
            case 39:
            case 40:
              e.preventDefault(), this.selectNext();
          }
        });
    }
    updated() {
      const e = this.getElement();
      for (let t = 0; t < this.pages.length; t++) {
        const i = this.pages[t];
        i === e ? i.classList.remove('hidden') : i.classList.add('hidden');
      }
      (this.current = e || void 0),
        this.current &&
          this.current.wiredRender &&
          requestAnimationFrame(() =>
            requestAnimationFrame(() => this.current.wiredRender())
          );
    }
    getElement() {
      let e = void 0;
      return (
        this.selected && (e = this.pageMap.get(this.selected)),
        e || (e = this.pages[0]),
        e || null
      );
    }
    selectPrevious() {
      const e = this.pages;
      if (e.length) {
        let t = -1;
        for (let i = 0; i < e.length; i++)
          if (e[i] === this.current) {
            t = i;
            break;
          }
        t < 0 ? (t = 0) : 0 === t ? (t = e.length - 1) : t--,
          (this.selected = e[t].name || '');
      }
    }
    selectNext() {
      const e = this.pages;
      if (e.length) {
        let t = -1;
        for (let i = 0; i < e.length; i++)
          if (e[i] === this.current) {
            t = i;
            break;
          }
        t < 0 ? (t = 0) : t >= e.length - 1 ? (t = 0) : t++,
          (this.selected = e[t].name || '');
      }
    }
  };
  Si(
    [re({ type: String }), Oi('design:type', String)],
    Ci.prototype,
    'selected',
    void 0
  ),
    Si(
      [ne('slot'), Oi('design:type', HTMLSlotElement)],
      Ci.prototype,
      'slotElement',
      void 0
    ),
    (Ci = Si([ie('wired-tabs')], Ci));
  var zi = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    ji = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let _i = class extends Fe {
    constructor() {
      super(...arguments),
        (this.disabled = !1),
        (this.rows = 2),
        (this.maxrows = 0),
        (this.autocomplete = ''),
        (this.autofocus = !1),
        (this.inputmode = ''),
        (this.placeholder = ''),
        (this.required = !1),
        (this.readonly = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
          font-family: sans-serif;
          width: 400px;
          outline: none;
          padding: 4px;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        textarea {
          position: relative;
          outline: none;
          border: none;
          resize: none;
          background: inherit;
          color: inherit;
          width: 100%;
          font-size: inherit;
          font-family: inherit;
          line-height: inherit;
          text-align: inherit;
          padding: 10px;
          box-sizing: border-box;
        }
      `
      ];
    }
    render() {
      return E`
    <textarea id="textarea" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" inputmode="${this.inputmode}"
      placeholder="${this.placeholder}" ?readonly="${this.readonly}" ?required="${this.required}" ?disabled="${this.disabled}"
      rows="${this.rows}" minlength="${this.minlength}" maxlength="${this.maxlength}"
      @change="${this.refire}" @input="${this.refire}"></textarea>
    <div id="overlay">
      <svg></svg>
    </div>
    `;
    }
    get textarea() {
      return this.textareaInput;
    }
    get value() {
      const e = this.textarea;
      return (e && e.value) || '';
    }
    set value(e) {
      if (this.shadowRoot) {
        const t = this.textarea;
        t && (t.value = e);
      } else this.pendingValue = e;
    }
    firstUpdated() {
      (this.value =
        this.pendingValue || this.value || this.getAttribute('value') || ''),
        delete this.pendingValue;
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      dt(e, 4, 4, t[0] - 4, t[1] - 4);
    }
    refire(e) {
      e.stopPropagation(), gt(this, e.type, { sourceEvent: e });
    }
  };
  zi(
    [re({ type: Boolean, reflect: !0 }), ji('design:type', Object)],
    _i.prototype,
    'disabled',
    void 0
  ),
    zi(
      [re({ type: Number }), ji('design:type', Object)],
      _i.prototype,
      'rows',
      void 0
    ),
    zi(
      [re({ type: Number }), ji('design:type', Object)],
      _i.prototype,
      'maxrows',
      void 0
    ),
    zi(
      [re({ type: String }), ji('design:type', Object)],
      _i.prototype,
      'autocomplete',
      void 0
    ),
    zi(
      [re({ type: Boolean }), ji('design:type', Object)],
      _i.prototype,
      'autofocus',
      void 0
    ),
    zi(
      [re({ type: String }), ji('design:type', Object)],
      _i.prototype,
      'inputmode',
      void 0
    ),
    zi(
      [re({ type: String }), ji('design:type', Object)],
      _i.prototype,
      'placeholder',
      void 0
    ),
    zi(
      [re({ type: Boolean }), ji('design:type', Object)],
      _i.prototype,
      'required',
      void 0
    ),
    zi(
      [re({ type: Boolean }), ji('design:type', Object)],
      _i.prototype,
      'readonly',
      void 0
    ),
    zi(
      [re({ type: Number }), ji('design:type', Number)],
      _i.prototype,
      'minlength',
      void 0
    ),
    zi(
      [re({ type: Number }), ji('design:type', Number)],
      _i.prototype,
      'maxlength',
      void 0
    ),
    zi(
      [ne('textarea'), ji('design:type', HTMLTextAreaElement)],
      _i.prototype,
      'textareaInput',
      void 0
    ),
    (_i = zi([ie('wired-textarea')], _i));
  var Mi = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    $i = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Pi = class extends Fe {
    constructor() {
      super(...arguments), (this.checked = !1), (this.disabled = !1);
    }
    static get styles() {
      return [
        Ue,
        pe`
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
        outline: none;
      }
      :host([disabled]) {
        opacity: 0.4 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
        opacity: 0;
      }
      .knob {
        transition: transform 0.3s ease;
      }
      .knob path {
        stroke-width: 0.7;
      }
      .knob.checked {
        transform: translateX(48px);
      }
      .knobfill path {
        stroke-width: 3 !important;
        fill: transparent;
      }
      .knob.unchecked .knobfill path {
        stroke: var(--wired-toggle-off-color, gray);
      }
      .knob.checked .knobfill path {
        stroke: var(--wired-toggle-on-color, rgb(63, 81, 181));
      }
      `
      ];
    }
    render() {
      return E`
    <div style="position: relative;">
      <svg></svg>
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}"  @change="${this.onChange}">
    </div>
    `;
    }
    focus() {
      this.input ? this.input.focus() : super.focus();
    }
    wiredRender(e = !1) {
      super.wiredRender(e), this.refreshKnob();
    }
    onChange() {
      (this.checked = this.input.checked),
        this.refreshKnob(),
        gt(this, 'change', { checked: this.checked });
    }
    canvasSize() {
      return [80, 34];
    }
    draw(e, t) {
      dt(e, 16, 8, t[0] - 32, 18),
        (this.knob = it('g')),
        this.knob.classList.add('knob'),
        e.appendChild(this.knob);
      const i = ut(16, 16, 32, 32);
      i.classList.add('knobfill'),
        this.knob.appendChild(i),
        lt(this.knob, 16, 16, 32, 32);
    }
    refreshKnob() {
      if (this.knob) {
        const e = this.knob.classList;
        this.checked
          ? (e.remove('unchecked'), e.add('checked'))
          : (e.remove('checked'), e.add('unchecked'));
      }
    }
  };
  Mi(
    [re({ type: Boolean }), $i('design:type', Object)],
    Pi.prototype,
    'checked',
    void 0
  ),
    Mi(
      [re({ type: Boolean, reflect: !0 }), $i('design:type', Object)],
      Pi.prototype,
      'disabled',
      void 0
    ),
    Mi(
      [ne('input'), $i('design:type', HTMLInputElement)],
      Pi.prototype,
      'input',
      void 0
    ),
    (Pi = Mi([ie('wired-toggle')], Pi));
  var Ni = function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    },
    Ei = function(e, t) {
      if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    };
  let Di = class extends Fe {
    constructor() {
      super(),
        (this.src = ''),
        (this.autoplay = !1),
        (this.loop = !1),
        (this.muted = !1),
        (this.playsinline = !1),
        (this.playing = !1),
        (this.timeDisplay = ''),
        window.ResizeObserver &&
          (this.resizeObserver = new window.ResizeObserver(() => {
            this.svg && this.wiredRender();
          }));
    }
    static get styles() {
      return [
        Ue,
        pe`
        :host {
          display: inline-block;
          position: relative;
          line-height: 1;
          padding: 3px 3px 68px;
          --wired-progress-color: var(--wired-video-highlight-color, rgb(51, 103, 214));
          --wired-slider-knob-color: var(--wired-video-highlight-color, rgb(51, 103, 214));
        }
        video {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
          max-height: 100%;
        }
        path {
          stroke-width: 1;
        }
        #controls {
          position: absolute;
          pointer-events: auto;
          left: 0;
          bottom: 0;
          width: 100%;
          box-sizing: border-box;
          height: 70px;
        }
        .layout.horizontal {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          padding: 5px 10px;
        }
        .flex {
          -ms-flex: 1 1 0.000000001px;
          -webkit-flex: 1;
          flex: 1;
          -webkit-flex-basis: 0.000000001px;
          flex-basis: 0.000000001px;
        }
        wired-progress {
          display: block;
          width: 100%;
          box-sizing: border-box;
          height: 20px;
          --wired-progress-label-color: transparent;
          --wired-progress-label-background: transparent;
        }
        wired-icon-button span {
          font-size: 16px;
          line-height: 16px;
          width: 16px;
          height: 16px;
          padding: 0px;
          font-family: sans-serif;
          display: inline-block;
        }
        #timeDisplay {
          padding: 0 20px 0 8px;
          font-size: 13px;
        }
        wired-slider {
          display: block;
          max-width: 200px;
          margin: 0 6px 0 auto;
        }
      `
      ];
    }
    render() {
      return E`
    <video
      .autoplay="${this.autoplay}"
      .loop="${this.loop}"
      .muted="${this.muted}"
      .playsinline="${this.playsinline}"
      src="${this.src}"
      @play="${() => (this.playing = !0)}"
      @pause="${() => (this.playing = !1)}"
      @canplay="${this.canPlay}"
      @timeupdate="${this.updateTime}">
    </video>
    <div id="overlay">
      <svg></svg>
    </div>
    <div id="controls">
      <wired-progress></wired-progress>
      <div class="horizontal layout center">
        <wired-icon-button @click="${this.togglePause}">
          <span>${this.playing ? '||' : '▶'}</span>
        </wired-icon-button>
        <div id="timeDisplay">${this.timeDisplay}</div>
        <div class="flex">
          <wired-slider @change="${this.volumeChange}"></wired-slider>
        </div>
        <div style="width: 24px; height: 24px;">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g><path style="stroke: none; fill: currentColor;" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></g></svg>
        </div>
      </div>
    </div>
    `;
    }
    updated() {
      super.updated(), this.attachResizeListener();
    }
    disconnectedCallback() {
      this.detachResizeListener();
    }
    attachResizeListener() {
      this.resizeObserver && this.resizeObserver.observe
        ? this.resizeObserver.observe(this)
        : this.windowResizeHandler ||
          ((this.windowResizeHandler = () => this.wiredRender()),
          window.addEventListener('resize', this.windowResizeHandler, {
            passive: !0
          }));
    }
    detachResizeListener() {
      this.resizeObserver &&
        this.resizeObserver.unobserve &&
        this.resizeObserver.unobserve(this),
        this.windowResizeHandler &&
          window.removeEventListener('resize', this.windowResizeHandler);
    }
    wiredRender() {
      super.wiredRender(), this.progressBar && this.progressBar.wiredRender(!0);
    }
    canvasSize() {
      const e = this.getBoundingClientRect();
      return [e.width, e.height];
    }
    draw(e, t) {
      dt(e, 2, 2, t[0] - 4, t[1] - 4);
    }
    updateTime() {
      this.video &&
        this.progressBar &&
        ((this.progressBar.value = this.video.duration
          ? Math.round((this.video.currentTime / this.video.duration) * 100)
          : 0),
        (this.timeDisplay = `${this.getTimeDisplay(
          this.video.currentTime
        )} / ${this.getTimeDisplay(this.video.duration)}`));
    }
    getTimeDisplay(e) {
      const t = Math.floor(e / 60);
      return `${t}:${Math.round(e - 60 * t)}`;
    }
    togglePause() {
      this.video && (this.playing ? this.video.pause() : this.video.play());
    }
    volumeChange() {
      this.video &&
        this.slider &&
        (this.video.volume = this.slider.value / 100);
    }
    canPlay() {
      this.slider &&
        this.video &&
        (this.slider.value = 100 * this.video.volume);
    }
  };
  Ni(
    [re({ type: String }), Ei('design:type', Object)],
    Di.prototype,
    'src',
    void 0
  ),
    Ni(
      [re({ type: Boolean }), Ei('design:type', Object)],
      Di.prototype,
      'autoplay',
      void 0
    ),
    Ni(
      [re({ type: Boolean }), Ei('design:type', Object)],
      Di.prototype,
      'loop',
      void 0
    ),
    Ni(
      [re({ type: Boolean }), Ei('design:type', Object)],
      Di.prototype,
      'muted',
      void 0
    ),
    Ni(
      [re({ type: Boolean }), Ei('design:type', Object)],
      Di.prototype,
      'playsinline',
      void 0
    ),
    Ni([re(), Ei('design:type', Object)], Di.prototype, 'playing', void 0),
    Ni([re(), Ei('design:type', Object)], Di.prototype, 'timeDisplay', void 0),
    Ni(
      [ne('wired-progress'), Ei('design:type', ri)],
      Di.prototype,
      'progressBar',
      void 0
    ),
    Ni(
      [ne('wired-slider'), Ei('design:type', bi)],
      Di.prototype,
      'slider',
      void 0
    ),
    Ni(
      [ne('video'), Ei('design:type', HTMLVideoElement)],
      Di.prototype,
      'video',
      void 0
    ),
    (Di = Ni([ie('wired-video'), Ei('design:paramtypes', [])], Di)),
    je.define({
      close:
        'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
      launch:
        'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'
    });
  const Ai = pe`:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}`;
  let Li = class extends ge {
    render() {
      return E`<slot></slot>`;
    }
  };
  (Li.styles = Ai),
    (Li = (function(e, t, i, s) {
      var o,
        r = arguments.length,
        n =
          r < 3
            ? t
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(t, i))
            : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        n = Reflect.decorate(e, t, i, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) &&
            (n = (r < 3 ? o(n) : r > 3 ? o(t, i, n) : o(t, i)) || n);
      return r > 3 && n && Object.defineProperty(t, i, n), n;
    })([ie('mwc-icon')], Li));
  const Ti = document.createElement('link');
  (Ti.rel = 'stylesheet'), (Ti.href = ''), document.head.appendChild(Ti);
  customElements.define(
    'wired-button-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      #styled {
         background: yellow;
         color: red;
      }
    </style>
    <p>
      <wired-button id="btn1">Submit</wired-button>
    </p>
    <p>
      <wired-button id="btn2">Hello, world!</wired-button>
    </p>
    <p>
      <wired-button elevation="5" id="btn2">Hello, world!</wired-button>
    </p>
    <p>
      <wired-button disabled id="btn1">Submit</wired-button>
    </p>
    <p>
      <wired-button id="styled" onclick="alert('NO!');">Do not press</wired-button>
    </p>
    `;
      }
    }
  );
  customElements.define(
    'wired-calendar-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
        font-family: 'Gloria Hallelujah', sans-serif;
      }

      .item_wrapper {
        margin-bottom: 30px;
        display: inline-block;
      }

      .custom {
        --wired-calendar-bg: yellow;
        --wired-calendar-color: red;
        --wired-calendar-selected-color: black;
        --wired-calendar-dimmed-color: brown;
      }
    </style>
    <!-- Minimal working calendar -->
    <div class="item_wrapper">
      <div>Minimal</div>
      <wired-calendar></wired-calendar>
    </div>

    <!-- Calendar with some parameters -->
    <div class="item_wrapper">
      <div>"fr" locale</div>
      <wired-calendar id="calendar2" elevation="1" firstdate="Apr 15, 2019" lastdate="Jul 15, 2019"
        selected="Jul 4, 2019" locale="fr" initials>
      </wired-calendar>
    </div>

    <!-- Calendar with custom style and some parameters -->
    <div class="item_wrapper">
      <div>"de" locale</div>
      <wired-calendar id="calendar3" class="custom" firstdate="Apr 15, 2019" locale="de" initials>
      </wired-calendar>
    </div>
    `;
      }
    }
  );
  customElements.define(
    'wired-card-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-card {
        max-width: 100%;
      }

      .card-grid {
        display: grid;
        gap: 30px;
        grid-template-columns: repeat(2, 1fr);
      }

      h4 {
        font-family: 'Gloria Hallelujah', sans-serif;
      }
    </style>
    <div class="card-grid">
      <wired-card>
        <h4>Card 1</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </wired-card>
      <wired-card elevation="5">
        <h4>Card 2</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </wired-card>
      <wired-card elevation="4" fill="darkred" style="color: lightyellow;">
        <h4>Colored Card</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </wired-card>
    </div>
    `;
      }
    }
  );
  customElements.define(
    'wired-checkbox-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-checkbox {
        margin: 0 15px;
        opacity: 1;
      }

      .custom {
        color: blue;
        --wired-checkbox-icon-color: red;
      }
    </style>
    <wired-checkbox>Checkbox One</wired-checkbox>
    <wired-checkbox checked>Checkbox Two</wired-checkbox>
    <wired-checkbox disabled>Disabled checkbox</wired-checkbox>
    <wired-checkbox class="custom">Styled checkbox</wired-checkbox>
    `;
      }
    }
  );
  customElements.define(
    'wired-combo-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-combo {
        margin: 10px;
        --wired-item-selected-bg: darkblue;
      }
    </style>
    <wired-combo selected="two">
      <wired-item value="one">Number one</wired-item>
      <wired-item value="two">Number two</wired-item>
      <wired-item value="three">Number three</wired-item>
      <wired-item value="four">Number four</wired-item>
    </wired-combo>
    <wired-combo selected="one" disabled>
      <wired-item value="one">Disabled</wired-item>
      <wired-item value="two">Number two</wired-item>
    </wired-combo>
    <wired-combo>
      <wired-item value="one">Number one</wired-item>
      <wired-item value="two">Number two</wired-item>
    </wired-combo>
    `;
      }
    }
  );
  customElements.define(
    'wired-dialog-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }
      p {
        max-width: 500px;
        margin: 0 auto;
      }
    </style>
    <p style="text-align: center;">
      <wired-button @click="${this.openDialog}">Show dialog</wired-button>
    </p>
    <wired-dialog>
      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
      <div style="text-align: right; padding: 30px 16px 16px;">
        <wired-button @click="${this.closeDialog}">Close dialog</wired-button>
      </div>
    </wired-dialog>
    `;
      }
      openDialog() {
        this.shadowRoot.querySelector('wired-dialog').open = !0;
      }
      closeDialog() {
        this.shadowRoot.querySelector('wired-dialog').open = !1;
      }
    }
  );
  customElements.define(
    'wired-divider-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      main {
        max-width: 600px;
        margin: 0 auto;
      }
    </style>
    <main>
      <section>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <wired-divider></wired-divider>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>
    </main>
    `;
      }
    }
  );
  customElements.define(
    'wired-fab-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-fab {
        margin: 0 10px;
      }

      .big {
        --wired-icon-size: 40px;
        padding: 16px;
      }

      .red {
        color: red;
      }

      .pinkbg {
        color: red;
        --wired-fab-bg-color: pink;
      }
    </style>
    <wired-fab>
      <mwc-icon>favorite</mwc-icon>
    </wired-fab>
    <wired-fab class="red">
      <mwc-icon>favorite</mwc-icon>
    </wired-fab>
    <wired-fab class="pinkbg">
      <mwc-icon>favorite</mwc-icon>
    </wired-fab>
    <wired-fab class="big">
      <mwc-icon>favorite</mwc-icon>
    </wired-fab>
    <wired-fab disabled>
      <mwc-icon>favorite</mwc-icon>
    </wired-fab>
    `;
      }
    }
  );
  customElements.define(
    'wired-icon-button-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-icon-button {
        margin: 0 10px;
      }

      .big {
        --wired-icon-size: 40px;
        padding: 16px;
      }

      .red {
        color: red;
      }

      .pinkbg {
        color: red;
        --wired-icon-bg-color: pink;
      }
    </style>
    <wired-icon-button>
      <mwc-icon>favorite</mwc-icon>
    </wired-icon-button>
    <wired-icon-button class="red">
      <mwc-icon>favorite</mwc-icon>
    </wired-icon-button>
    <wired-icon-button class="pinkbg">
      <mwc-icon>favorite</mwc-icon>
    </wired-icon-button>
    <wired-icon-button class="big">
      <mwc-icon>favorite</mwc-icon>
    </wired-icon-button>
    <wired-icon-button disabled>
      <mwc-icon>favorite</mwc-icon>
    </wired-icon-button>
    `;
      }
    }
  );
  customElements.define(
    'wired-image-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-image {
        margin: 20px;
      }

      .red {
        color: purple;
      }

      .sized {
        max-width: 400px;
        max-height: 400px;
      }
    </style>
    <wired-image src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-image>
    <wired-image elevation="4" class="red" src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-image>
    <wired-image src="https://www.gstatic.com/webp/gallery/4.jpg"></wired-image>
    <wired-image class="sized" elevation="5" src="https://www.gstatic.com/webp/gallery/4.jpg"></wired-image>
    `;
      }
    }
  );
  customElements.define(
    'wired-input-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-input {
        margin: 5px 15px;
      }
    </style>
    <wired-input placeholder="Enter name"></wired-input>
    <wired-input type="password" placeholder="Password"></wired-input>
    <wired-input placeholder="Disabled" disabled></wired-input>
    `;
      }
    }
  );
  customElements.define(
    'wired-link-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }
      p {
        max-width: 500px;
        margin: 0 auto;
      }
    </style>
    <p>
      This is a paragraph and here's a link about <wired-link href="https://github.com/wiredjs/wired-elements/tree/master/packages/wired-button">wired-button</wired-link> and well well
      well, what do you know, same link with more elevation <wired-link elevation="3" href="https://github.com/wiredjs/wired-elements/tree/master/packages/wired-button">wired-button
      </wired-link>.
      Here's another link that opens in a new tab about <wired-link href="https://github.com/wiredjs/wired-elements/tree/master/packages/wired-input" target="_blank">wired-input
      </wired-link>. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
      et dolore magna aliqua.
    </p>
    `;
      }
    }
  );
  customElements.define(
    'wired-listbox-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-listbox {
        margin: 5px;
        --wired-item-selected-bg: darkblue;
      }

      .customListBox {
        --wired-item-selected-bg: pink;
        --wired-item-selected-color: darkred;
      }
    </style>
    <wired-listbox selected="one">
      <wired-item value="one">No. one</wired-item>
      <wired-item value="two">No. two</wired-item>
      <wired-item value="three">No. three</wired-item>
      <wired-item value="four">No. four</wired-item>
    </wired-listbox>

    <wired-listbox horizontal class="customListBox" selected="two">
      <wired-item value="one">No. one</wired-item>
      <wired-item value="two">No. two</wired-item>
      <wired-item value="three">No. three</wired-item>
      <wired-item value="four">No. four</wired-item>
    </wired-listbox>
    `;
      }
    }
  );
  customElements.define(
    'wired-progress-demo',
    class extends ge {
      constructor() {
        super(), (this.timer = 0);
      }
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-progress {
        margin: 10px;
      }

      wired-button {
        margin: 0 10px;
      }

      .custom {
        --wired-progress-color: rgba(220, 0, 50, 0.1);
        --wired-progress-label-color: green;
        width: 300px;
        height: 2em;
      }
    </style>
    <wired-progress value="25"></wired-progress>
    <wired-progress value="65" percentage></wired-progress>
    <wired-progress class="custom" value="30"></wired-progress>
    <section style="margin-top: 16px;">
      <wired-progress id="progress"></wired-progress>
      <div style="margin-top: 16px;">
        <wired-button id="btns" @click="${this.start}">Start</wired-button>
        <wired-button id="btnr" @click="${this.stop}">Stop</wired-button>
      </div>
    </section>
    `;
      }
      start() {
        const e = this.shadowRoot.getElementById('progress');
        this.timer && window.clearInterval(this.timer),
          (this.timer = window.setInterval(() => {
            e.value >= 100 ? (e.value = 0) : (e.value = e.value + 1);
          }, 100));
      }
      stop() {
        const e = this.shadowRoot.getElementById('progress');
        this.timer && (window.clearInterval(this.timer), (this.timer = 0)),
          (e.value = 0);
      }
    }
  );
  customElements.define(
    'wired-radio-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
        font-family: 'Gloria Hallelujah', sans-serif;
      }

      wired-radio {
        margin: 0 15px;
        opacity: 1;
      }

      .custom {
        color: blue;
        --wired-radio-icon-color: red;
      }
    </style>
    <wired-radio-group id="rg" selected="two">
      <wired-radio name="one">One</wired-radio>
      <wired-radio name="two">Two</wired-radio>
      <wired-radio name="three">Three</wired-radio>
      <wired-radio class="custom" name="four">Four</wired-radio>
    </wired-radio-group>
    `;
      }
    }
  );
  customElements.define(
    'wired-search-input-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-search-input {
        margin: 5px 15px;
      }
    </style>
    <wired-search-input placeholder="Search here"></wired-search-input>
    <wired-search-input placeholder="Disabled" disabled></wired-search-input>
    `;
      }
    }
  );
  customElements.define(
    'wired-slider-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-slider {
        margin: 5px 0;
        max-width: 100%;
        box-sizing: border-box;
      }

      .custom {
        width: 200px;
        --wired-slider-knob-color: green;
        --wired-slider-bar-color: blue;
      }
    </style>
    <wired-slider></wired-slider>
    <wired-slider value="40"></wired-slider>
    <wired-slider value="10" min="5" max="15"></wired-slider>
    <wired-slider value="60" disabled></wired-slider>
    <wired-slider class="custom" value="25"></wired-slider>
    `;
      }
    }
  );
  customElements.define(
    'wired-spinner-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-spinner {
        margin: 10px;
      }

      .custom {
        color: red;
      }
    </style>
    <wired-spinner id="sp"></wired-spinner>
    <wired-spinner class="custom" spinning duration="1000"></wired-spinner>

    <div style="margin-top: 30px;">
      <wired-button @click="${this.toggle}">Toggle</wired-button>
    </div>
    `;
      }
      toggle() {
        const e = this.shadowRoot.getElementById('sp');
        e.spinning = !e.spinning;
      }
    }
  );
  customElements.define(
    'wired-tabs-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-tabs {
        max-width: 600px;
        margin: 0 auto;
      }

      h4 {
        font-family: 'Gloria Hallelujah', sans-serif;
      }
    </style>
    <wired-tabs selected="Three">
      <wired-tab name="One">
        <h4>Card 1</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </wired-tab>
      <wired-tab name="Two">
        <h4>Card 2</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </wired-tab>
      <wired-tab name="Three">
        <h4>Card 3</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </wired-tab>
      <wired-tab name="Four">
        <h4>Card 4</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </wired-tab>
    </wired-tabs>
    `;
      }
    }
  );
  customElements.define(
    'wired-textarea-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
        font-size: 16px;
      }

      wired-textarea {
        margin: 10px 0;
        box-sizing: border-box;
        max-width: 100%;
      }
    </style>
    <wired-textarea placeholder="Enter text"></wired-textarea>
    <wired-textarea placeholder="Enter text 6 rows" rows="6"></wired-textarea>
    <wired-textarea disabled placeholder="disabled" rows="2"></wired-textarea>
    `;
      }
    }
  );
  customElements.define(
    'wired-toggle-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
      }

      wired-toggle {
        margin: 10px;
      }

      .custom {
        --wired-toggle-off-color: red;
        --wired-toggle-on-color: green;
      }
    </style>
    <wired-toggle></wired-toggle>
    <wired-toggle class="custom" checked></wired-toggle>
    <wired-toggle disabled></wired-toggle>
    `;
      }
    }
  );
  customElements.define(
    'wired-video-demo',
    class extends ge {
      render() {
        return E`
    <style>
      :host {
        display: block;
        padding: 16px;
        font-size: 16px;
      }

      .pink {
        --wired-video-highlight-color: purple;
      }
    </style>
    <p>
      <wired-video autoplay playsinline muted loop
        src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4">
      </wired-video>
    </p>
    <p>
      <wired-video class="pink" src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4">
      </wired-video>
    </p>
    `;
      }
    }
  );
  class Ii extends ge {
    static get properties() {
      return { page: { type: Object } };
    }
    static get styles() {
      return me;
    }
    constructor() {
      super(), (this.page = fe[0]), (this.currentDemo = null);
    }
    render() {
      return E`
    <style>
      :host {
        display: block;
        --soso-drawer-overlay-bg: #37474F;
        --soso-app-drawer-border: none;
        --soso-highlight-color: #f0e6f4;
        --soso-highlight-foreground: #37474F;
      }
      soso-app-bar {
        text-align: center;
        letter-spacing: 0.5px;
        background: #37474F;
        text-transform: capitalize;
        color: white;
      }
      a, a:hover, a:visited {
        color: inherit;
        text-decoration: none;
      }
      .drawerTitle {
        text-transform: lowercase;
        color: #f0e6f4;
        font-size: 18px;
      }
      .logo {
        height: 40px;
        width: 40px;
        display: block;
        border-radius: 50%;
        padding: 6px;
        margin: 0 5px;
      }
      #barLogoLink {
        display: none;
      }
      #title {
        text-transform: lowercase;
      }
      soso-list {
        display: block;
        margin: 20px 0;
        color: white;
      }

      @media (max-width: 840px) {
        #barLogoLink {
          display: block;
        }
      }
    </style>
    <soso-app-shell>
      <soso-app-bar slot="toolbar">
        <soso-icon-button slot="nav" icon="menu"></soso-icon-button>
        <a id="barLogoLink" href="/" slot="leading">
          <img alt="Wired Elements Logo" class="logo" src="images/logo_400.png">
        </a>
        <div slot="title" id="title">${this.page.name}</div>
        <a slot="actions" target="_blank" href="${this.page.url}">
          <soso-icon-button icon="launch"></soso-icon-button>
        </a>
      </soso-app-bar>
      <nav slot="drawer">
        <div class="horizontal layout center">
          <a href="/">
            <img alt="Wired Elements Logo" class="logo" src="images/logo_400.png">
          </a>
          <a  class="flex" href="/"><div class="drawerTitle">Wired Elements</div></a>
        </div>
        <soso-list .selected="${this.page.name}" @change="${this.onPageSelect}">
          ${Se(
            fe,
            e => e.name,
            e => E`<soso-item .value="${e.name}">${e.name}</soso-item>`
          )}
        </soso-list>
      </nav>
      <div id="main" slot="main">
      </div>
    </soso-app-shell>
    `;
    }
    onPageSelect(e) {
      const t = (function(e) {
        for (const t of fe) if (t.name === e) return t;
        return null;
      })(e.detail.selected);
      t && (this.page = t),
        (this.shadowRoot.querySelector('soso-app-shell').drawerOpen = !1);
    }
    updated() {
      this.refreshView();
    }
    refreshView() {
      if (this.page) {
        const e = `${this.page.name}-demo`;
        if (this.currentDemo && this.currentDemo.tagName.toLowerCase() === e)
          return;
        const t = this.shadowRoot.querySelector('#main');
        t &&
          (this.currentDemo && t.removeChild(this.currentDemo),
          (this.currentDemo = document.createElement(e)),
          t.appendChild(this.currentDemo));
      }
    }
  }
  return customElements.define('showcase-app', Ii), (e.ShowcaseApp = Ii), e;
})({});
