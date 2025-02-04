!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.deepgram = t())
    : (e.deepgram = t());
})(self, () =>
  (() => {
    var e = {
        5993: (e, t, r) => {
          "use strict";
          function n(e) {
            return "transcriptionData" in e;
          }
          r.r(t),
            r.d(t, {
              AssemblyAiConverter: () => d,
              DeepgramConverter: () => l,
              chunkArray: () => c,
              isConverter: () => n,
              secondsToTimestamp: () => u,
              srt: () => v,
              webvtt: () => f,
            });
          var s = r(7484),
            o = r.n(s),
            i = r(4576),
            a = r.n(i);
          function u(e, t = "HH:mm:ss.SSS") {
            return o()(1e3 * e)
              .utc()
              .format(t);
          }
          function c(e, t) {
            const r = [];
            for (let n = 0; n < e.length; n += t) {
              const s = e.slice(n, n + t);
              r.push(s);
            }
            return r;
          }
          o().extend(a());
          class l {
            constructor(e) {
              this.transcriptionData = e;
            }
            getLines(e = 8) {
              const { results: t } = this.transcriptionData;
              let r = [];
              if (t.utterances)
                t.utterances.forEach((t) => {
                  t.words.length > e
                    ? r.push(...c(t.words, e))
                    : r.push(t.words);
                });
              else {
                const n = t.channels[0].alternatives[0].words,
                  s = "speaker" in n[0];
                let o = [],
                  i = 0;
                n.forEach((t) => {
                  var n;
                  s && t.speaker !== i && (r.push(o), (o = [])),
                    o.length === e && (r.push(o), (o = [])),
                    s && (i = null !== (n = t.speaker) && void 0 !== n ? n : 0),
                    o.push(t);
                }),
                  r.push(o);
              }
              return r;
            }
            getHeaders() {
              var e, t, r, n, s, o, i, a;
              const u = [];
              return (
                u.push("NOTE"),
                u.push("Transcription provided by Deepgram"),
                (null === (e = this.transcriptionData.metadata) || void 0 === e
                  ? void 0
                  : e.request_id) &&
                  u.push(
                    `Request Id: ${
                      null === (t = this.transcriptionData.metadata) ||
                      void 0 === t
                        ? void 0
                        : t.request_id
                    }`
                  ),
                (null === (r = this.transcriptionData.metadata) || void 0 === r
                  ? void 0
                  : r.created) &&
                  u.push(
                    `Created: ${
                      null === (n = this.transcriptionData.metadata) ||
                      void 0 === n
                        ? void 0
                        : n.created
                    }`
                  ),
                (null === (s = this.transcriptionData.metadata) || void 0 === s
                  ? void 0
                  : s.duration) &&
                  u.push(
                    `Duration: ${
                      null === (o = this.transcriptionData.metadata) ||
                      void 0 === o
                        ? void 0
                        : o.duration
                    }`
                  ),
                (null === (i = this.transcriptionData.metadata) || void 0 === i
                  ? void 0
                  : i.channels) &&
                  u.push(
                    `Channels: ${
                      null === (a = this.transcriptionData.metadata) ||
                      void 0 === a
                        ? void 0
                        : a.channels
                    }`
                  ),
                u
              );
            }
          }
          const h = (e) => ({
            word: e.text,
            start: e.start,
            end: e.end,
            confidence: e.confidence,
            punctuated_word: e.text,
            speaker: e.speaker,
          });
          class d {
            constructor(e) {
              this.transcriptionData = e;
            }
            getLines(e = 8) {
              const t = this.transcriptionData;
              let r = [];
              return (
                t.utterances
                  ? t.utterances.forEach((t) => {
                      t.words.length > e
                        ? r.push(
                            ...c(
                              t.words.map((e) => h(e)),
                              e
                            )
                          )
                        : r.push(t.words.map((e) => h(e)));
                    })
                  : r.push(
                      ...c(
                        t.words.map((e) => h(e)),
                        e
                      )
                    ),
                r
              );
            }
            getHeaders() {
              const e = [];
              return (
                e.push("NOTE"),
                e.push("Transcription provided by Assembly AI"),
                this.transcriptionData.id &&
                  e.push(`Id: ${this.transcriptionData.id}`),
                this.transcriptionData.audio_duration &&
                  e.push(`Duration: ${this.transcriptionData.audio_duration}`),
                e
              );
            }
          }
          const p = (e) => (n(e) ? e : new l(e)),
            f = (e, t = 8) => {
              const r = [];
              let n = p(e);
              r.push("WEBVTT"),
                r.push(""),
                n.getHeaders && r.push(n.getHeaders().join("\n")),
                n.getHeaders && r.push("");
              const s = n.getLines(t),
                o = "speaker" in s[0][0];
              return (
                s.forEach((e) => {
                  const t = e[0],
                    n = e[e.length - 1];
                  r.push(`${u(t.start)} --\x3e ${u(n.end)}`);
                  const s = e
                      .map((e) => {
                        var t;
                        return null !== (t = e.punctuated_word) && void 0 !== t
                          ? t
                          : e.word;
                      })
                      .join(" "),
                    i = o ? `<v Speaker ${t.speaker}>` : "";
                  r.push(`${i}${s}`), r.push("");
                }),
                r.join("\n")
              );
            },
            v = (e, t = 8) => {
              const r = [];
              let n = p(e).getLines(t);
              const s = "speaker" in n[0][0];
              let o,
                i = 1;
              return (
                n.forEach((e) => {
                  r.push((i++).toString());
                  const t = e[0],
                    n = e[e.length - 1];
                  r.push(
                    `${u(t.start, "HH:mm:ss,SSS")} --\x3e ${u(
                      n.end,
                      "HH:mm:ss,SSS"
                    )}`
                  );
                  const a = e
                      .map((e) => {
                        var t;
                        return null !== (t = e.punctuated_word) && void 0 !== t
                          ? t
                          : e.word;
                      })
                      .join(" "),
                    c = s && o !== t.speaker ? `[Speaker ${t.speaker}]\n` : "";
                  r.push(`${c}${a}`), r.push(""), (o = t.speaker);
                }),
                r.join("\n")
              );
            };
        },
        4098: function (e, t) {
          var r = "undefined" != typeof self ? self : this,
            n = (function () {
              function e() {
                (this.fetch = !1), (this.DOMException = r.DOMException);
              }
              return (e.prototype = r), new e();
            })();
          !(function (e) {
            !(function (t) {
              var r = "URLSearchParams" in e,
                n = "Symbol" in e && "iterator" in Symbol,
                s =
                  "FileReader" in e &&
                  "Blob" in e &&
                  (function () {
                    try {
                      return new Blob(), !0;
                    } catch (e) {
                      return !1;
                    }
                  })(),
                o = "FormData" in e,
                i = "ArrayBuffer" in e;
              if (i)
                var a = [
                    "[object Int8Array]",
                    "[object Uint8Array]",
                    "[object Uint8ClampedArray]",
                    "[object Int16Array]",
                    "[object Uint16Array]",
                    "[object Int32Array]",
                    "[object Uint32Array]",
                    "[object Float32Array]",
                    "[object Float64Array]",
                  ],
                  u =
                    ArrayBuffer.isView ||
                    function (e) {
                      return (
                        e && a.indexOf(Object.prototype.toString.call(e)) > -1
                      );
                    };
              function c(e) {
                if (
                  ("string" != typeof e && (e = String(e)),
                  /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(e))
                )
                  throw new TypeError("Invalid character in header field name");
                return e.toLowerCase();
              }
              function l(e) {
                return "string" != typeof e && (e = String(e)), e;
              }
              function h(e) {
                var t = {
                  next: function () {
                    var t = e.shift();
                    return { done: void 0 === t, value: t };
                  },
                };
                return (
                  n &&
                    (t[Symbol.iterator] = function () {
                      return t;
                    }),
                  t
                );
              }
              function d(e) {
                (this.map = {}),
                  e instanceof d
                    ? e.forEach(function (e, t) {
                        this.append(t, e);
                      }, this)
                    : Array.isArray(e)
                    ? e.forEach(function (e) {
                        this.append(e[0], e[1]);
                      }, this)
                    : e &&
                      Object.getOwnPropertyNames(e).forEach(function (t) {
                        this.append(t, e[t]);
                      }, this);
              }
              function p(e) {
                if (e.bodyUsed)
                  return Promise.reject(new TypeError("Already read"));
                e.bodyUsed = !0;
              }
              function f(e) {
                return new Promise(function (t, r) {
                  (e.onload = function () {
                    t(e.result);
                  }),
                    (e.onerror = function () {
                      r(e.error);
                    });
                });
              }
              function v(e) {
                var t = new FileReader(),
                  r = f(t);
                return t.readAsArrayBuffer(e), r;
              }
              function y(e) {
                if (e.slice) return e.slice(0);
                var t = new Uint8Array(e.byteLength);
                return t.set(new Uint8Array(e)), t.buffer;
              }
              function g() {
                return (
                  (this.bodyUsed = !1),
                  (this._initBody = function (e) {
                    var t;
                    (this._bodyInit = e),
                      e
                        ? "string" == typeof e
                          ? (this._bodyText = e)
                          : s && Blob.prototype.isPrototypeOf(e)
                          ? (this._bodyBlob = e)
                          : o && FormData.prototype.isPrototypeOf(e)
                          ? (this._bodyFormData = e)
                          : r && URLSearchParams.prototype.isPrototypeOf(e)
                          ? (this._bodyText = e.toString())
                          : i &&
                            s &&
                            (t = e) &&
                            DataView.prototype.isPrototypeOf(t)
                          ? ((this._bodyArrayBuffer = y(e.buffer)),
                            (this._bodyInit = new Blob([
                              this._bodyArrayBuffer,
                            ])))
                          : i &&
                            (ArrayBuffer.prototype.isPrototypeOf(e) || u(e))
                          ? (this._bodyArrayBuffer = y(e))
                          : (this._bodyText = e =
                              Object.prototype.toString.call(e))
                        : (this._bodyText = ""),
                      this.headers.get("content-type") ||
                        ("string" == typeof e
                          ? this.headers.set(
                              "content-type",
                              "text/plain;charset=UTF-8"
                            )
                          : this._bodyBlob && this._bodyBlob.type
                          ? this.headers.set(
                              "content-type",
                              this._bodyBlob.type
                            )
                          : r &&
                            URLSearchParams.prototype.isPrototypeOf(e) &&
                            this.headers.set(
                              "content-type",
                              "application/x-www-form-urlencoded;charset=UTF-8"
                            ));
                  }),
                  s &&
                    ((this.blob = function () {
                      var e = p(this);
                      if (e) return e;
                      if (this._bodyBlob)
                        return Promise.resolve(this._bodyBlob);
                      if (this._bodyArrayBuffer)
                        return Promise.resolve(
                          new Blob([this._bodyArrayBuffer])
                        );
                      if (this._bodyFormData)
                        throw new Error("could not read FormData body as blob");
                      return Promise.resolve(new Blob([this._bodyText]));
                    }),
                    (this.arrayBuffer = function () {
                      return this._bodyArrayBuffer
                        ? p(this) || Promise.resolve(this._bodyArrayBuffer)
                        : this.blob().then(v);
                    })),
                  (this.text = function () {
                    var e,
                      t,
                      r,
                      n = p(this);
                    if (n) return n;
                    if (this._bodyBlob)
                      return (
                        (e = this._bodyBlob),
                        (r = f((t = new FileReader()))),
                        t.readAsText(e),
                        r
                      );
                    if (this._bodyArrayBuffer)
                      return Promise.resolve(
                        (function (e) {
                          for (
                            var t = new Uint8Array(e),
                              r = new Array(t.length),
                              n = 0;
                            n < t.length;
                            n++
                          )
                            r[n] = String.fromCharCode(t[n]);
                          return r.join("");
                        })(this._bodyArrayBuffer)
                      );
                    if (this._bodyFormData)
                      throw new Error("could not read FormData body as text");
                    return Promise.resolve(this._bodyText);
                  }),
                  o &&
                    (this.formData = function () {
                      return this.text().then(_);
                    }),
                  (this.json = function () {
                    return this.text().then(JSON.parse);
                  }),
                  this
                );
              }
              (d.prototype.append = function (e, t) {
                (e = c(e)), (t = l(t));
                var r = this.map[e];
                this.map[e] = r ? r + ", " + t : t;
              }),
                (d.prototype.delete = function (e) {
                  delete this.map[c(e)];
                }),
                (d.prototype.get = function (e) {
                  return (e = c(e)), this.has(e) ? this.map[e] : null;
                }),
                (d.prototype.has = function (e) {
                  return this.map.hasOwnProperty(c(e));
                }),
                (d.prototype.set = function (e, t) {
                  this.map[c(e)] = l(t);
                }),
                (d.prototype.forEach = function (e, t) {
                  for (var r in this.map)
                    this.map.hasOwnProperty(r) &&
                      e.call(t, this.map[r], r, this);
                }),
                (d.prototype.keys = function () {
                  var e = [];
                  return (
                    this.forEach(function (t, r) {
                      e.push(r);
                    }),
                    h(e)
                  );
                }),
                (d.prototype.values = function () {
                  var e = [];
                  return (
                    this.forEach(function (t) {
                      e.push(t);
                    }),
                    h(e)
                  );
                }),
                (d.prototype.entries = function () {
                  var e = [];
                  return (
                    this.forEach(function (t, r) {
                      e.push([r, t]);
                    }),
                    h(e)
                  );
                }),
                n && (d.prototype[Symbol.iterator] = d.prototype.entries);
              var b = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
              function m(e, t) {
                var r,
                  n,
                  s = (t = t || {}).body;
                if (e instanceof m) {
                  if (e.bodyUsed) throw new TypeError("Already read");
                  (this.url = e.url),
                    (this.credentials = e.credentials),
                    t.headers || (this.headers = new d(e.headers)),
                    (this.method = e.method),
                    (this.mode = e.mode),
                    (this.signal = e.signal),
                    s ||
                      null == e._bodyInit ||
                      ((s = e._bodyInit), (e.bodyUsed = !0));
                } else this.url = String(e);
                if (
                  ((this.credentials =
                    t.credentials || this.credentials || "same-origin"),
                  (!t.headers && this.headers) ||
                    (this.headers = new d(t.headers)),
                  (this.method =
                    ((n = (r = t.method || this.method || "GET").toUpperCase()),
                    b.indexOf(n) > -1 ? n : r)),
                  (this.mode = t.mode || this.mode || null),
                  (this.signal = t.signal || this.signal),
                  (this.referrer = null),
                  ("GET" === this.method || "HEAD" === this.method) && s)
                )
                  throw new TypeError(
                    "Body not allowed for GET or HEAD requests"
                  );
                this._initBody(s);
              }
              function _(e) {
                var t = new FormData();
                return (
                  e
                    .trim()
                    .split("&")
                    .forEach(function (e) {
                      if (e) {
                        var r = e.split("="),
                          n = r.shift().replace(/\+/g, " "),
                          s = r.join("=").replace(/\+/g, " ");
                        t.append(decodeURIComponent(n), decodeURIComponent(s));
                      }
                    }),
                  t
                );
              }
              function w(e, t) {
                t || (t = {}),
                  (this.type = "default"),
                  (this.status = void 0 === t.status ? 200 : t.status),
                  (this.ok = this.status >= 200 && this.status < 300),
                  (this.statusText = "statusText" in t ? t.statusText : "OK"),
                  (this.headers = new d(t.headers)),
                  (this.url = t.url || ""),
                  this._initBody(e);
              }
              (m.prototype.clone = function () {
                return new m(this, { body: this._bodyInit });
              }),
                g.call(m.prototype),
                g.call(w.prototype),
                (w.prototype.clone = function () {
                  return new w(this._bodyInit, {
                    status: this.status,
                    statusText: this.statusText,
                    headers: new d(this.headers),
                    url: this.url,
                  });
                }),
                (w.error = function () {
                  var e = new w(null, { status: 0, statusText: "" });
                  return (e.type = "error"), e;
                });
              var O = [301, 302, 303, 307, 308];
              (w.redirect = function (e, t) {
                if (-1 === O.indexOf(t))
                  throw new RangeError("Invalid status code");
                return new w(null, { status: t, headers: { location: e } });
              }),
                (t.DOMException = e.DOMException);
              try {
                new t.DOMException();
              } catch (e) {
                (t.DOMException = function (e, t) {
                  (this.message = e), (this.name = t);
                  var r = Error(e);
                  this.stack = r.stack;
                }),
                  (t.DOMException.prototype = Object.create(Error.prototype)),
                  (t.DOMException.prototype.constructor = t.DOMException);
              }
              function j(e, r) {
                return new Promise(function (n, o) {
                  var i = new m(e, r);
                  if (i.signal && i.signal.aborted)
                    return o(new t.DOMException("Aborted", "AbortError"));
                  var a = new XMLHttpRequest();
                  function u() {
                    a.abort();
                  }
                  (a.onload = function () {
                    var e,
                      t,
                      r = {
                        status: a.status,
                        statusText: a.statusText,
                        headers:
                          ((e = a.getAllResponseHeaders() || ""),
                          (t = new d()),
                          e
                            .replace(/\r?\n[\t ]+/g, " ")
                            .split(/\r?\n/)
                            .forEach(function (e) {
                              var r = e.split(":"),
                                n = r.shift().trim();
                              if (n) {
                                var s = r.join(":").trim();
                                t.append(n, s);
                              }
                            }),
                          t),
                      };
                    r.url =
                      "responseURL" in a
                        ? a.responseURL
                        : r.headers.get("X-Request-URL");
                    var s = "response" in a ? a.response : a.responseText;
                    n(new w(s, r));
                  }),
                    (a.onerror = function () {
                      o(new TypeError("Network request failed"));
                    }),
                    (a.ontimeout = function () {
                      o(new TypeError("Network request failed"));
                    }),
                    (a.onabort = function () {
                      o(new t.DOMException("Aborted", "AbortError"));
                    }),
                    a.open(i.method, i.url, !0),
                    "include" === i.credentials
                      ? (a.withCredentials = !0)
                      : "omit" === i.credentials && (a.withCredentials = !1),
                    "responseType" in a && s && (a.responseType = "blob"),
                    i.headers.forEach(function (e, t) {
                      a.setRequestHeader(t, e);
                    }),
                    i.signal &&
                      (i.signal.addEventListener("abort", u),
                      (a.onreadystatechange = function () {
                        4 === a.readyState &&
                          i.signal.removeEventListener("abort", u);
                      })),
                    a.send(void 0 === i._bodyInit ? null : i._bodyInit);
                });
              }
              (j.polyfill = !0),
                e.fetch ||
                  ((e.fetch = j),
                  (e.Headers = d),
                  (e.Request = m),
                  (e.Response = w)),
                (t.Headers = d),
                (t.Request = m),
                (t.Response = w),
                (t.fetch = j),
                Object.defineProperty(t, "__esModule", { value: !0 });
            })({});
          })(n),
            (n.fetch.ponyfill = !0),
            delete n.fetch.polyfill;
          var s = n;
          ((t = s.fetch).default = s.fetch),
            (t.fetch = s.fetch),
            (t.Headers = s.Headers),
            (t.Request = s.Request),
            (t.Response = s.Response),
            (e.exports = t);
        },
        7484: function (e) {
          e.exports = (function () {
            "use strict";
            var e = 6e4,
              t = 36e5,
              r = "millisecond",
              n = "second",
              s = "minute",
              o = "hour",
              i = "day",
              a = "week",
              u = "month",
              c = "quarter",
              l = "year",
              h = "date",
              d = "Invalid Date",
              p =
                /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
              f =
                /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
              v = {
                name: "en",
                weekdays:
                  "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
                    "_"
                  ),
                months:
                  "January_February_March_April_May_June_July_August_September_October_November_December".split(
                    "_"
                  ),
                ordinal: function (e) {
                  var t = ["th", "st", "nd", "rd"],
                    r = e % 100;
                  return "[" + e + (t[(r - 20) % 10] || t[r] || t[0]) + "]";
                },
              },
              y = function (e, t, r) {
                var n = String(e);
                return !n || n.length >= t
                  ? e
                  : "" + Array(t + 1 - n.length).join(r) + e;
              },
              g = {
                s: y,
                z: function (e) {
                  var t = -e.utcOffset(),
                    r = Math.abs(t),
                    n = Math.floor(r / 60),
                    s = r % 60;
                  return (
                    (t <= 0 ? "+" : "-") + y(n, 2, "0") + ":" + y(s, 2, "0")
                  );
                },
                m: function e(t, r) {
                  if (t.date() < r.date()) return -e(r, t);
                  var n = 12 * (r.year() - t.year()) + (r.month() - t.month()),
                    s = t.clone().add(n, u),
                    o = r - s < 0,
                    i = t.clone().add(n + (o ? -1 : 1), u);
                  return +(-(n + (r - s) / (o ? s - i : i - s)) || 0);
                },
                a: function (e) {
                  return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
                },
                p: function (e) {
                  return (
                    {
                      M: u,
                      y: l,
                      w: a,
                      d: i,
                      D: h,
                      h: o,
                      m: s,
                      s: n,
                      ms: r,
                      Q: c,
                    }[e] ||
                    String(e || "")
                      .toLowerCase()
                      .replace(/s$/, "")
                  );
                },
                u: function (e) {
                  return void 0 === e;
                },
              },
              b = "en",
              m = {};
            m[b] = v;
            var _ = "$isDayjsObject",
              w = function (e) {
                return e instanceof S || !(!e || !e[_]);
              },
              O = function e(t, r, n) {
                var s;
                if (!t) return b;
                if ("string" == typeof t) {
                  var o = t.toLowerCase();
                  m[o] && (s = o), r && ((m[o] = r), (s = o));
                  var i = t.split("-");
                  if (!s && i.length > 1) return e(i[0]);
                } else {
                  var a = t.name;
                  (m[a] = t), (s = a);
                }
                return !n && s && (b = s), s || (!n && b);
              },
              j = function (e, t) {
                if (w(e)) return e.clone();
                var r = "object" == typeof t ? t : {};
                return (r.date = e), (r.args = arguments), new S(r);
              },
              E = g;
            (E.l = O),
              (E.i = w),
              (E.w = function (e, t) {
                return j(e, {
                  locale: t.$L,
                  utc: t.$u,
                  x: t.$x,
                  $offset: t.$offset,
                });
              });
            var S = (function () {
                function v(e) {
                  (this.$L = O(e.locale, null, !0)),
                    this.parse(e),
                    (this.$x = this.$x || e.x || {}),
                    (this[_] = !0);
                }
                var y = v.prototype;
                return (
                  (y.parse = function (e) {
                    (this.$d = (function (e) {
                      var t = e.date,
                        r = e.utc;
                      if (null === t) return new Date(NaN);
                      if (E.u(t)) return new Date();
                      if (t instanceof Date) return new Date(t);
                      if ("string" == typeof t && !/Z$/i.test(t)) {
                        var n = t.match(p);
                        if (n) {
                          var s = n[2] - 1 || 0,
                            o = (n[7] || "0").substring(0, 3);
                          return r
                            ? new Date(
                                Date.UTC(
                                  n[1],
                                  s,
                                  n[3] || 1,
                                  n[4] || 0,
                                  n[5] || 0,
                                  n[6] || 0,
                                  o
                                )
                              )
                            : new Date(
                                n[1],
                                s,
                                n[3] || 1,
                                n[4] || 0,
                                n[5] || 0,
                                n[6] || 0,
                                o
                              );
                        }
                      }
                      return new Date(t);
                    })(e)),
                      this.init();
                  }),
                  (y.init = function () {
                    var e = this.$d;
                    (this.$y = e.getFullYear()),
                      (this.$M = e.getMonth()),
                      (this.$D = e.getDate()),
                      (this.$W = e.getDay()),
                      (this.$H = e.getHours()),
                      (this.$m = e.getMinutes()),
                      (this.$s = e.getSeconds()),
                      (this.$ms = e.getMilliseconds());
                  }),
                  (y.$utils = function () {
                    return E;
                  }),
                  (y.isValid = function () {
                    return !(this.$d.toString() === d);
                  }),
                  (y.isSame = function (e, t) {
                    var r = j(e);
                    return this.startOf(t) <= r && r <= this.endOf(t);
                  }),
                  (y.isAfter = function (e, t) {
                    return j(e) < this.startOf(t);
                  }),
                  (y.isBefore = function (e, t) {
                    return this.endOf(t) < j(e);
                  }),
                  (y.$g = function (e, t, r) {
                    return E.u(e) ? this[t] : this.set(r, e);
                  }),
                  (y.unix = function () {
                    return Math.floor(this.valueOf() / 1e3);
                  }),
                  (y.valueOf = function () {
                    return this.$d.getTime();
                  }),
                  (y.startOf = function (e, t) {
                    var r = this,
                      c = !!E.u(t) || t,
                      d = E.p(e),
                      p = function (e, t) {
                        var n = E.w(
                          r.$u ? Date.UTC(r.$y, t, e) : new Date(r.$y, t, e),
                          r
                        );
                        return c ? n : n.endOf(i);
                      },
                      f = function (e, t) {
                        return E.w(
                          r
                            .toDate()
                            [e].apply(
                              r.toDate("s"),
                              (c ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(t)
                            ),
                          r
                        );
                      },
                      v = this.$W,
                      y = this.$M,
                      g = this.$D,
                      b = "set" + (this.$u ? "UTC" : "");
                    switch (d) {
                      case l:
                        return c ? p(1, 0) : p(31, 11);
                      case u:
                        return c ? p(1, y) : p(0, y + 1);
                      case a:
                        var m = this.$locale().weekStart || 0,
                          _ = (v < m ? v + 7 : v) - m;
                        return p(c ? g - _ : g + (6 - _), y);
                      case i:
                      case h:
                        return f(b + "Hours", 0);
                      case o:
                        return f(b + "Minutes", 1);
                      case s:
                        return f(b + "Seconds", 2);
                      case n:
                        return f(b + "Milliseconds", 3);
                      default:
                        return this.clone();
                    }
                  }),
                  (y.endOf = function (e) {
                    return this.startOf(e, !1);
                  }),
                  (y.$set = function (e, t) {
                    var a,
                      c = E.p(e),
                      d = "set" + (this.$u ? "UTC" : ""),
                      p = ((a = {}),
                      (a[i] = d + "Date"),
                      (a[h] = d + "Date"),
                      (a[u] = d + "Month"),
                      (a[l] = d + "FullYear"),
                      (a[o] = d + "Hours"),
                      (a[s] = d + "Minutes"),
                      (a[n] = d + "Seconds"),
                      (a[r] = d + "Milliseconds"),
                      a)[c],
                      f = c === i ? this.$D + (t - this.$W) : t;
                    if (c === u || c === l) {
                      var v = this.clone().set(h, 1);
                      v.$d[p](f),
                        v.init(),
                        (this.$d = v.set(
                          h,
                          Math.min(this.$D, v.daysInMonth())
                        ).$d);
                    } else p && this.$d[p](f);
                    return this.init(), this;
                  }),
                  (y.set = function (e, t) {
                    return this.clone().$set(e, t);
                  }),
                  (y.get = function (e) {
                    return this[E.p(e)]();
                  }),
                  (y.add = function (r, c) {
                    var h,
                      d = this;
                    r = Number(r);
                    var p = E.p(c),
                      f = function (e) {
                        var t = j(d);
                        return E.w(t.date(t.date() + Math.round(e * r)), d);
                      };
                    if (p === u) return this.set(u, this.$M + r);
                    if (p === l) return this.set(l, this.$y + r);
                    if (p === i) return f(1);
                    if (p === a) return f(7);
                    var v =
                        ((h = {}), (h[s] = e), (h[o] = t), (h[n] = 1e3), h)[
                          p
                        ] || 1,
                      y = this.$d.getTime() + r * v;
                    return E.w(y, this);
                  }),
                  (y.subtract = function (e, t) {
                    return this.add(-1 * e, t);
                  }),
                  (y.format = function (e) {
                    var t = this,
                      r = this.$locale();
                    if (!this.isValid()) return r.invalidDate || d;
                    var n = e || "YYYY-MM-DDTHH:mm:ssZ",
                      s = E.z(this),
                      o = this.$H,
                      i = this.$m,
                      a = this.$M,
                      u = r.weekdays,
                      c = r.months,
                      l = r.meridiem,
                      h = function (e, r, s, o) {
                        return (e && (e[r] || e(t, n))) || s[r].slice(0, o);
                      },
                      p = function (e) {
                        return E.s(o % 12 || 12, e, "0");
                      },
                      v =
                        l ||
                        function (e, t, r) {
                          var n = e < 12 ? "AM" : "PM";
                          return r ? n.toLowerCase() : n;
                        };
                    return n.replace(f, function (e, n) {
                      return (
                        n ||
                        (function (e) {
                          switch (e) {
                            case "YY":
                              return String(t.$y).slice(-2);
                            case "YYYY":
                              return E.s(t.$y, 4, "0");
                            case "M":
                              return a + 1;
                            case "MM":
                              return E.s(a + 1, 2, "0");
                            case "MMM":
                              return h(r.monthsShort, a, c, 3);
                            case "MMMM":
                              return h(c, a);
                            case "D":
                              return t.$D;
                            case "DD":
                              return E.s(t.$D, 2, "0");
                            case "d":
                              return String(t.$W);
                            case "dd":
                              return h(r.weekdaysMin, t.$W, u, 2);
                            case "ddd":
                              return h(r.weekdaysShort, t.$W, u, 3);
                            case "dddd":
                              return u[t.$W];
                            case "H":
                              return String(o);
                            case "HH":
                              return E.s(o, 2, "0");
                            case "h":
                              return p(1);
                            case "hh":
                              return p(2);
                            case "a":
                              return v(o, i, !0);
                            case "A":
                              return v(o, i, !1);
                            case "m":
                              return String(i);
                            case "mm":
                              return E.s(i, 2, "0");
                            case "s":
                              return String(t.$s);
                            case "ss":
                              return E.s(t.$s, 2, "0");
                            case "SSS":
                              return E.s(t.$ms, 3, "0");
                            case "Z":
                              return s;
                          }
                          return null;
                        })(e) ||
                        s.replace(":", "")
                      );
                    });
                  }),
                  (y.utcOffset = function () {
                    return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
                  }),
                  (y.diff = function (r, h, d) {
                    var p,
                      f = this,
                      v = E.p(h),
                      y = j(r),
                      g = (y.utcOffset() - this.utcOffset()) * e,
                      b = this - y,
                      m = function () {
                        return E.m(f, y);
                      };
                    switch (v) {
                      case l:
                        p = m() / 12;
                        break;
                      case u:
                        p = m();
                        break;
                      case c:
                        p = m() / 3;
                        break;
                      case a:
                        p = (b - g) / 6048e5;
                        break;
                      case i:
                        p = (b - g) / 864e5;
                        break;
                      case o:
                        p = b / t;
                        break;
                      case s:
                        p = b / e;
                        break;
                      case n:
                        p = b / 1e3;
                        break;
                      default:
                        p = b;
                    }
                    return d ? p : E.a(p);
                  }),
                  (y.daysInMonth = function () {
                    return this.endOf(u).$D;
                  }),
                  (y.$locale = function () {
                    return m[this.$L];
                  }),
                  (y.locale = function (e, t) {
                    if (!e) return this.$L;
                    var r = this.clone(),
                      n = O(e, t, !0);
                    return n && (r.$L = n), r;
                  }),
                  (y.clone = function () {
                    return E.w(this.$d, this);
                  }),
                  (y.toDate = function () {
                    return new Date(this.valueOf());
                  }),
                  (y.toJSON = function () {
                    return this.isValid() ? this.toISOString() : null;
                  }),
                  (y.toISOString = function () {
                    return this.$d.toISOString();
                  }),
                  (y.toString = function () {
                    return this.$d.toUTCString();
                  }),
                  v
                );
              })(),
              D = S.prototype;
            return (
              (j.prototype = D),
              [
                ["$ms", r],
                ["$s", n],
                ["$m", s],
                ["$H", o],
                ["$W", i],
                ["$M", u],
                ["$y", l],
                ["$D", h],
              ].forEach(function (e) {
                D[e[1]] = function (t) {
                  return this.$g(t, e[0], e[1]);
                };
              }),
              (j.extend = function (e, t) {
                return e.$i || (e(t, S, j), (e.$i = !0)), j;
              }),
              (j.locale = O),
              (j.isDayjs = w),
              (j.unix = function (e) {
                return j(1e3 * e);
              }),
              (j.en = m[b]),
              (j.Ls = m),
              (j.p = {}),
              j
            );
          })();
        },
        4576: function (e) {
          e.exports = (function () {
            "use strict";
            var e = "minute",
              t = /[+-]\d\d(?::?\d\d)?/g,
              r = /([+-]|\d\d)/g;
            return function (n, s, o) {
              var i = s.prototype;
              (o.utc = function (e) {
                return new s({ date: e, utc: !0, args: arguments });
              }),
                (i.utc = function (t) {
                  var r = o(this.toDate(), { locale: this.$L, utc: !0 });
                  return t ? r.add(this.utcOffset(), e) : r;
                }),
                (i.local = function () {
                  return o(this.toDate(), { locale: this.$L, utc: !1 });
                });
              var a = i.parse;
              i.parse = function (e) {
                e.utc && (this.$u = !0),
                  this.$utils().u(e.$offset) || (this.$offset = e.$offset),
                  a.call(this, e);
              };
              var u = i.init;
              i.init = function () {
                if (this.$u) {
                  var e = this.$d;
                  (this.$y = e.getUTCFullYear()),
                    (this.$M = e.getUTCMonth()),
                    (this.$D = e.getUTCDate()),
                    (this.$W = e.getUTCDay()),
                    (this.$H = e.getUTCHours()),
                    (this.$m = e.getUTCMinutes()),
                    (this.$s = e.getUTCSeconds()),
                    (this.$ms = e.getUTCMilliseconds());
                } else u.call(this);
              };
              var c = i.utcOffset;
              i.utcOffset = function (n, s) {
                var o = this.$utils().u;
                if (o(n))
                  return this.$u
                    ? 0
                    : o(this.$offset)
                    ? c.call(this)
                    : this.$offset;
                if (
                  "string" == typeof n &&
                  ((n = (function (e) {
                    void 0 === e && (e = "");
                    var n = e.match(t);
                    if (!n) return null;
                    var s = ("" + n[0]).match(r) || ["-", 0, 0],
                      o = s[0],
                      i = 60 * +s[1] + +s[2];
                    return 0 === i ? 0 : "+" === o ? i : -i;
                  })(n)),
                  null === n)
                )
                  return this;
                var i = Math.abs(n) <= 16 ? 60 * n : n,
                  a = this;
                if (s) return (a.$offset = i), (a.$u = 0 === n), a;
                if (0 !== n) {
                  var u = this.$u
                    ? this.toDate().getTimezoneOffset()
                    : -1 * this.utcOffset();
                  ((a = this.local().add(i + u, e)).$offset = i),
                    (a.$x.$localOffset = u);
                } else a = this.utc();
                return a;
              };
              var l = i.format;
              (i.format = function (e) {
                var t = e || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
                return l.call(this, t);
              }),
                (i.valueOf = function () {
                  var e = this.$utils().u(this.$offset)
                    ? 0
                    : this.$offset +
                      (this.$x.$localOffset || this.$d.getTimezoneOffset());
                  return this.$d.valueOf() - 6e4 * e;
                }),
                (i.isUTC = function () {
                  return !!this.$u;
                }),
                (i.toISOString = function () {
                  return this.toDate().toISOString();
                }),
                (i.toString = function () {
                  return this.toDate().toUTCString();
                });
              var h = i.toDate;
              i.toDate = function (e) {
                return "s" === e && this.$offset
                  ? o(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate()
                  : h.call(this);
              };
              var d = i.diff;
              i.diff = function (e, t, r) {
                if (e && this.$u === e.$u) return d.call(this, e, t, r);
                var n = this.local(),
                  s = o(e).local();
                return d.call(n, s, t, r);
              };
            };
          })();
        },
        9996: (e) => {
          "use strict";
          var t = function (e) {
              return (
                (function (e) {
                  return !!e && "object" == typeof e;
                })(e) &&
                !(function (e) {
                  var t = Object.prototype.toString.call(e);
                  return (
                    "[object RegExp]" === t ||
                    "[object Date]" === t ||
                    (function (e) {
                      return e.$$typeof === r;
                    })(e)
                  );
                })(e)
              );
            },
            r =
              "function" == typeof Symbol && Symbol.for
                ? Symbol.for("react.element")
                : 60103;
          function n(e, t) {
            return !1 !== t.clone && t.isMergeableObject(e)
              ? a(((r = e), Array.isArray(r) ? [] : {}), e, t)
              : e;
            var r;
          }
          function s(e, t, r) {
            return e.concat(t).map(function (e) {
              return n(e, r);
            });
          }
          function o(e) {
            return Object.keys(e).concat(
              (function (e) {
                return Object.getOwnPropertySymbols
                  ? Object.getOwnPropertySymbols(e).filter(function (t) {
                      return Object.propertyIsEnumerable.call(e, t);
                    })
                  : [];
              })(e)
            );
          }
          function i(e, t) {
            try {
              return t in e;
            } catch (e) {
              return !1;
            }
          }
          function a(e, r, u) {
            ((u = u || {}).arrayMerge = u.arrayMerge || s),
              (u.isMergeableObject = u.isMergeableObject || t),
              (u.cloneUnlessOtherwiseSpecified = n);
            var c = Array.isArray(r);
            return c === Array.isArray(e)
              ? c
                ? u.arrayMerge(e, r, u)
                : (function (e, t, r) {
                    var s = {};
                    return (
                      r.isMergeableObject(e) &&
                        o(e).forEach(function (t) {
                          s[t] = n(e[t], r);
                        }),
                      o(t).forEach(function (o) {
                        (function (e, t) {
                          return (
                            i(e, t) &&
                            !(
                              Object.hasOwnProperty.call(e, t) &&
                              Object.propertyIsEnumerable.call(e, t)
                            )
                          );
                        })(e, o) ||
                          (i(e, o) && r.isMergeableObject(t[o])
                            ? (s[o] = (function (e, t) {
                                if (!t.customMerge) return a;
                                var r = t.customMerge(e);
                                return "function" == typeof r ? r : a;
                              })(o, r)(e[o], t[o], r))
                            : (s[o] = n(t[o], r)));
                      }),
                      s
                    );
                  })(e, r, u)
              : n(r, u);
          }
          a.all = function (e, t) {
            if (!Array.isArray(e))
              throw new Error("first argument should be an array");
            return e.reduce(function (e, r) {
              return a(e, r, t);
            }, {});
          };
          var u = a;
          e.exports = u;
        },
        7187: (e) => {
          "use strict";
          var t,
            r = "object" == typeof Reflect ? Reflect : null,
            n =
              r && "function" == typeof r.apply
                ? r.apply
                : function (e, t, r) {
                    return Function.prototype.apply.call(e, t, r);
                  };
          t =
            r && "function" == typeof r.ownKeys
              ? r.ownKeys
              : Object.getOwnPropertySymbols
              ? function (e) {
                  return Object.getOwnPropertyNames(e).concat(
                    Object.getOwnPropertySymbols(e)
                  );
                }
              : function (e) {
                  return Object.getOwnPropertyNames(e);
                };
          var s =
            Number.isNaN ||
            function (e) {
              return e != e;
            };
          function o() {
            o.init.call(this);
          }
          (e.exports = o),
            (e.exports.once = function (e, t) {
              return new Promise(function (r, n) {
                function s(r) {
                  e.removeListener(t, o), n(r);
                }
                function o() {
                  "function" == typeof e.removeListener &&
                    e.removeListener("error", s),
                    r([].slice.call(arguments));
                }
                v(e, t, o, { once: !0 }),
                  "error" !== t &&
                    (function (e, t, r) {
                      "function" == typeof e.on &&
                        v(e, "error", t, { once: !0 });
                    })(e, s);
              });
            }),
            (o.EventEmitter = o),
            (o.prototype._events = void 0),
            (o.prototype._eventsCount = 0),
            (o.prototype._maxListeners = void 0);
          var i = 10;
          function a(e) {
            if ("function" != typeof e)
              throw new TypeError(
                'The "listener" argument must be of type Function. Received type ' +
                  typeof e
              );
          }
          function u(e) {
            return void 0 === e._maxListeners
              ? o.defaultMaxListeners
              : e._maxListeners;
          }
          function c(e, t, r, n) {
            var s, o, i, c;
            if (
              (a(r),
              void 0 === (o = e._events)
                ? ((o = e._events = Object.create(null)), (e._eventsCount = 0))
                : (void 0 !== o.newListener &&
                    (e.emit("newListener", t, r.listener ? r.listener : r),
                    (o = e._events)),
                  (i = o[t])),
              void 0 === i)
            )
              (i = o[t] = r), ++e._eventsCount;
            else if (
              ("function" == typeof i
                ? (i = o[t] = n ? [r, i] : [i, r])
                : n
                ? i.unshift(r)
                : i.push(r),
              (s = u(e)) > 0 && i.length > s && !i.warned)
            ) {
              i.warned = !0;
              var l = new Error(
                "Possible EventEmitter memory leak detected. " +
                  i.length +
                  " " +
                  String(t) +
                  " listeners added. Use emitter.setMaxListeners() to increase limit"
              );
              (l.name = "MaxListenersExceededWarning"),
                (l.emitter = e),
                (l.type = t),
                (l.count = i.length),
                (c = l),
                console && console.warn && console.warn(c);
            }
            return e;
          }
          function l() {
            if (!this.fired)
              return (
                this.target.removeListener(this.type, this.wrapFn),
                (this.fired = !0),
                0 === arguments.length
                  ? this.listener.call(this.target)
                  : this.listener.apply(this.target, arguments)
              );
          }
          function h(e, t, r) {
            var n = {
                fired: !1,
                wrapFn: void 0,
                target: e,
                type: t,
                listener: r,
              },
              s = l.bind(n);
            return (s.listener = r), (n.wrapFn = s), s;
          }
          function d(e, t, r) {
            var n = e._events;
            if (void 0 === n) return [];
            var s = n[t];
            return void 0 === s
              ? []
              : "function" == typeof s
              ? r
                ? [s.listener || s]
                : [s]
              : r
              ? (function (e) {
                  for (var t = new Array(e.length), r = 0; r < t.length; ++r)
                    t[r] = e[r].listener || e[r];
                  return t;
                })(s)
              : f(s, s.length);
          }
          function p(e) {
            var t = this._events;
            if (void 0 !== t) {
              var r = t[e];
              if ("function" == typeof r) return 1;
              if (void 0 !== r) return r.length;
            }
            return 0;
          }
          function f(e, t) {
            for (var r = new Array(t), n = 0; n < t; ++n) r[n] = e[n];
            return r;
          }
          function v(e, t, r, n) {
            if ("function" == typeof e.on) n.once ? e.once(t, r) : e.on(t, r);
            else {
              if ("function" != typeof e.addEventListener)
                throw new TypeError(
                  'The "emitter" argument must be of type EventEmitter. Received type ' +
                    typeof e
                );
              e.addEventListener(t, function s(o) {
                n.once && e.removeEventListener(t, s), r(o);
              });
            }
          }
          Object.defineProperty(o, "defaultMaxListeners", {
            enumerable: !0,
            get: function () {
              return i;
            },
            set: function (e) {
              if ("number" != typeof e || e < 0 || s(e))
                throw new RangeError(
                  'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                    e +
                    "."
                );
              i = e;
            },
          }),
            (o.init = function () {
              (void 0 !== this._events &&
                this._events !== Object.getPrototypeOf(this)._events) ||
                ((this._events = Object.create(null)), (this._eventsCount = 0)),
                (this._maxListeners = this._maxListeners || void 0);
            }),
            (o.prototype.setMaxListeners = function (e) {
              if ("number" != typeof e || e < 0 || s(e))
                throw new RangeError(
                  'The value of "n" is out of range. It must be a non-negative number. Received ' +
                    e +
                    "."
                );
              return (this._maxListeners = e), this;
            }),
            (o.prototype.getMaxListeners = function () {
              return u(this);
            }),
            (o.prototype.emit = function (e) {
              for (var t = [], r = 1; r < arguments.length; r++)
                t.push(arguments[r]);
              var s = "error" === e,
                o = this._events;
              if (void 0 !== o) s = s && void 0 === o.error;
              else if (!s) return !1;
              if (s) {
                var i;
                if ((t.length > 0 && (i = t[0]), i instanceof Error)) throw i;
                var a = new Error(
                  "Unhandled error." + (i ? " (" + i.message + ")" : "")
                );
                throw ((a.context = i), a);
              }
              var u = o[e];
              if (void 0 === u) return !1;
              if ("function" == typeof u) n(u, this, t);
              else {
                var c = u.length,
                  l = f(u, c);
                for (r = 0; r < c; ++r) n(l[r], this, t);
              }
              return !0;
            }),
            (o.prototype.addListener = function (e, t) {
              return c(this, e, t, !1);
            }),
            (o.prototype.on = o.prototype.addListener),
            (o.prototype.prependListener = function (e, t) {
              return c(this, e, t, !0);
            }),
            (o.prototype.once = function (e, t) {
              return a(t), this.on(e, h(this, e, t)), this;
            }),
            (o.prototype.prependOnceListener = function (e, t) {
              return a(t), this.prependListener(e, h(this, e, t)), this;
            }),
            (o.prototype.removeListener = function (e, t) {
              var r, n, s, o, i;
              if ((a(t), void 0 === (n = this._events))) return this;
              if (void 0 === (r = n[e])) return this;
              if (r === t || r.listener === t)
                0 == --this._eventsCount
                  ? (this._events = Object.create(null))
                  : (delete n[e],
                    n.removeListener &&
                      this.emit("removeListener", e, r.listener || t));
              else if ("function" != typeof r) {
                for (s = -1, o = r.length - 1; o >= 0; o--)
                  if (r[o] === t || r[o].listener === t) {
                    (i = r[o].listener), (s = o);
                    break;
                  }
                if (s < 0) return this;
                0 === s
                  ? r.shift()
                  : (function (e, t) {
                      for (; t + 1 < e.length; t++) e[t] = e[t + 1];
                      e.pop();
                    })(r, s),
                  1 === r.length && (n[e] = r[0]),
                  void 0 !== n.removeListener &&
                    this.emit("removeListener", e, i || t);
              }
              return this;
            }),
            (o.prototype.off = o.prototype.removeListener),
            (o.prototype.removeAllListeners = function (e) {
              var t, r, n;
              if (void 0 === (r = this._events)) return this;
              if (void 0 === r.removeListener)
                return (
                  0 === arguments.length
                    ? ((this._events = Object.create(null)),
                      (this._eventsCount = 0))
                    : void 0 !== r[e] &&
                      (0 == --this._eventsCount
                        ? (this._events = Object.create(null))
                        : delete r[e]),
                  this
                );
              if (0 === arguments.length) {
                var s,
                  o = Object.keys(r);
                for (n = 0; n < o.length; ++n)
                  "removeListener" !== (s = o[n]) && this.removeAllListeners(s);
                return (
                  this.removeAllListeners("removeListener"),
                  (this._events = Object.create(null)),
                  (this._eventsCount = 0),
                  this
                );
              }
              if ("function" == typeof (t = r[e])) this.removeListener(e, t);
              else if (void 0 !== t)
                for (n = t.length - 1; n >= 0; n--)
                  this.removeListener(e, t[n]);
              return this;
            }),
            (o.prototype.listeners = function (e) {
              return d(this, e, !0);
            }),
            (o.prototype.rawListeners = function (e) {
              return d(this, e, !1);
            }),
            (o.listenerCount = function (e, t) {
              return "function" == typeof e.listenerCount
                ? e.listenerCount(t)
                : p.call(e, t);
            }),
            (o.prototype.listenerCount = p),
            (o.prototype.eventNames = function () {
              return this._eventsCount > 0 ? t(this._events) : [];
            });
        },
        5274: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(8752),
            s = r(8458);
          class o extends s.AbstractClient {
            get listen() {
              return new s.ListenClient(this.options);
            }
            get manage() {
              return new s.ManageClient(this.options);
            }
            get onprem() {
              return this.selfhosted;
            }
            get selfhosted() {
              return new s.SelfHostedRestClient(this.options);
            }
            get read() {
              return new s.ReadClient(this.options);
            }
            get speak() {
              return new s.SpeakClient(this.options);
            }
            get transcription() {
              throw new n.DeepgramVersionError();
            }
            get projects() {
              throw new n.DeepgramVersionError();
            }
            get keys() {
              throw new n.DeepgramVersionError();
            }
            get members() {
              throw new n.DeepgramVersionError();
            }
            get scopes() {
              throw new n.DeepgramVersionError();
            }
            get invitation() {
              throw new n.DeepgramVersionError();
            }
            get usage() {
              throw new n.DeepgramVersionError();
            }
            get billing() {
              throw new n.DeepgramVersionError();
            }
          }
          t.default = o;
        },
        341: function (e, t, r) {
          "use strict";
          var n =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var s = Object.getOwnPropertyDescriptor(t, r);
                    (s &&
                      !("get" in s
                        ? !t.__esModule
                        : s.writable || s.configurable)) ||
                      (s = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, s);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            s =
              (this && this.__exportStar) ||
              function (e, t) {
                for (var r in e)
                  "default" === r ||
                    Object.prototype.hasOwnProperty.call(t, r) ||
                    n(t, e, r);
              },
            o =
              (this && this.__importDefault) ||
              function (e) {
                return e && e.__esModule ? e : { default: e };
              };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.srt =
              t.webvtt =
              t.Deepgram =
              t.DeepgramClient =
              t.createClient =
                void 0);
          const i = r(8752),
            a = o(r(5274));
          (t.DeepgramClient = a.default),
            (t.Deepgram = class {
              constructor(e, t, r) {
                throw (
                  ((this.apiKey = e),
                  (this.apiUrl = t),
                  (this.requireSSL = r),
                  new i.DeepgramVersionError())
                );
              }
            }),
            (t.createClient = function (e, t) {
              let r = {};
              return (
                "string" == typeof e || "function" == typeof e
                  ? ("object" == typeof t && (r = t), (r.key = e))
                  : "object" == typeof e && (r = e),
                new a.default(r)
              );
            }),
            s(r(8458), t),
            s(r(6475), t),
            s(r(57), t),
            s(r(4678), t),
            s(r(8752), t),
            s(r(610), t);
          var u = r(5993);
          Object.defineProperty(t, "webvtt", {
            enumerable: !0,
            get: function () {
              return u.webvtt;
            },
          }),
            Object.defineProperty(t, "srt", {
              enumerable: !0,
              get: function () {
                return u.srt;
              },
            });
        },
        4678: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.CONNECTION_STATE =
              t.SOCKET_STATES =
              t.DEFAULT_OPTIONS =
              t.DEFAULT_GLOBAL_OPTIONS =
              t.DEFAULT_URL =
              t.DEFAULT_HEADERS =
              t.BROWSER_AGENT =
              t.BUN_VERSION =
              t.NODE_VERSION =
                void 0);
          const n = r(610),
            s = r(1506);
          var o, i;
          (t.NODE_VERSION =
            "undefined" != typeof process &&
            process.versions &&
            process.versions.node
              ? process.versions.node
              : "unknown"),
            (t.BUN_VERSION =
              "undefined" != typeof process &&
              process.versions &&
              process.versions.bun
                ? process.versions.bun
                : "unknown"),
            (t.BROWSER_AGENT =
              "undefined" != typeof window &&
              window.navigator &&
              window.navigator.userAgent
                ? window.navigator.userAgent
                : "unknown"),
            (t.DEFAULT_HEADERS = {
              "Content-Type": "application/json",
              "X-Client-Info": `@deepgram/sdk; ${
                (0, n.isBrowser)() ? "browser" : "server"
              }; v${s.version}`,
              "User-Agent": `@deepgram/sdk/${s.version} ${
                (0, n.isNode)()
                  ? `node/${t.NODE_VERSION}`
                  : (0, n.isBun)()
                  ? `bun/${t.BUN_VERSION}`
                  : (0, n.isBrowser)()
                  ? `javascript ${t.BROWSER_AGENT}`
                  : "unknown"
              }`,
            }),
            (t.DEFAULT_URL = "https://api.deepgram.com"),
            (t.DEFAULT_GLOBAL_OPTIONS = {
              fetch: {
                options: { url: t.DEFAULT_URL, headers: t.DEFAULT_HEADERS },
              },
              websocket: {
                options: {
                  url: (0, n.convertProtocolToWs)(t.DEFAULT_URL),
                  _nodeOnlyHeaders: t.DEFAULT_HEADERS,
                },
              },
            }),
            (t.DEFAULT_OPTIONS = { global: t.DEFAULT_GLOBAL_OPTIONS }),
            ((i = t.SOCKET_STATES || (t.SOCKET_STATES = {}))[
              (i.connecting = 0)
            ] = "connecting"),
            (i[(i.open = 1)] = "open"),
            (i[(i.closing = 2)] = "closing"),
            (i[(i.closed = 3)] = "closed"),
            ((o = t.CONNECTION_STATE || (t.CONNECTION_STATE = {})).Connecting =
              "connecting"),
            (o.Open = "open"),
            (o.Closing = "closing"),
            (o.Closed = "closed");
        },
        4615: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.LiveConnectionState = void 0);
          const n = r(4678);
          var s;
          ((s = t.LiveConnectionState || (t.LiveConnectionState = {}))[
            (s.CONNECTING = n.SOCKET_STATES.connecting)
          ] = "CONNECTING"),
            (s[(s.OPEN = n.SOCKET_STATES.open)] = "OPEN"),
            (s[(s.CLOSING = n.SOCKET_STATES.closing)] = "CLOSING"),
            (s[(s.CLOSED = n.SOCKET_STATES.closed)] = "CLOSED");
        },
        3178: (e, t) => {
          "use strict";
          var r;
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.LiveTranscriptionEvents = void 0),
            ((r =
              t.LiveTranscriptionEvents ||
              (t.LiveTranscriptionEvents = {})).Open = "open"),
            (r.Close = "close"),
            (r.Error = "error"),
            (r.Transcript = "Results"),
            (r.Metadata = "Metadata"),
            (r.UtteranceEnd = "UtteranceEnd"),
            (r.SpeechStarted = "SpeechStarted"),
            (r.Unhandled = "Unhandled");
        },
        57: function (e, t, r) {
          "use strict";
          var n =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var s = Object.getOwnPropertyDescriptor(t, r);
                    (s &&
                      !("get" in s
                        ? !t.__esModule
                        : s.writable || s.configurable)) ||
                      (s = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, s);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            s =
              (this && this.__exportStar) ||
              function (e, t) {
                for (var r in e)
                  "default" === r ||
                    Object.prototype.hasOwnProperty.call(t, r) ||
                    n(t, e, r);
              };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            s(r(4615), t),
            s(r(3178), t);
        },
        8752: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.DeepgramVersionError =
              t.DeepgramUnknownError =
              t.DeepgramApiError =
              t.isDeepgramError =
              t.DeepgramError =
                void 0);
          class r extends Error {
            constructor(e) {
              super(e), (this.__dgError = !0), (this.name = "DeepgramError");
            }
          }
          (t.DeepgramError = r),
            (t.isDeepgramError = function (e) {
              return "object" == typeof e && null !== e && "__dgError" in e;
            }),
            (t.DeepgramApiError = class extends r {
              constructor(e, t) {
                super(e), (this.name = "DeepgramApiError"), (this.status = t);
              }
              toJSON() {
                return {
                  name: this.name,
                  message: this.message,
                  status: this.status,
                };
              }
            }),
            (t.DeepgramUnknownError = class extends r {
              constructor(e, t) {
                super(e),
                  (this.name = "DeepgramUnknownError"),
                  (this.originalError = t);
              }
            }),
            (t.DeepgramVersionError = class extends r {
              constructor() {
                super(
                  "You are attempting to use an old format for a newer SDK version. Read more here: https://dpgr.am/js-v3"
                ),
                  (this.name = "DeepgramVersionError");
              }
            });
        },
        8716: function (e, t, r) {
          "use strict";
          var n =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var s = Object.getOwnPropertyDescriptor(t, r);
                    (s &&
                      !("get" in s
                        ? !t.__esModule
                        : s.writable || s.configurable)) ||
                      (s = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, s);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            s =
              (this && this.__setModuleDefault) ||
              (Object.create
                ? function (e, t) {
                    Object.defineProperty(e, "default", {
                      enumerable: !0,
                      value: t,
                    });
                  }
                : function (e, t) {
                    e.default = t;
                  }),
            o =
              (this && this.__importStar) ||
              function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                  for (var r in e)
                    "default" !== r &&
                      Object.prototype.hasOwnProperty.call(e, r) &&
                      n(t, e, r);
                return s(t, e), t;
              },
            i =
              (this && this.__awaiter) ||
              function (e, t, r, n) {
                return new (r || (r = Promise))(function (s, o) {
                  function i(e) {
                    try {
                      u(n.next(e));
                    } catch (e) {
                      o(e);
                    }
                  }
                  function a(e) {
                    try {
                      u(n.throw(e));
                    } catch (e) {
                      o(e);
                    }
                  }
                  function u(e) {
                    var t;
                    e.done
                      ? s(e.value)
                      : ((t = e.value),
                        t instanceof r
                          ? t
                          : new r(function (e) {
                              e(t);
                            })).then(i, a);
                  }
                  u((n = n.apply(e, t || [])).next());
                });
              },
            a =
              (this && this.__importDefault) ||
              function (e) {
                return e && e.__esModule ? e : { default: e };
              };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.resolveResponse = t.fetchWithAuth = t.resolveFetch = void 0);
          const u = r(610),
            c = a(r(4098));
          (t.resolveFetch = (e) => {
            let t;
            return (
              (t = e || ("undefined" == typeof fetch ? c.default : fetch)),
              (...e) => t(...e)
            );
          }),
            (t.fetchWithAuth = (e, r) => {
              const n = (0, t.resolveFetch)(r),
                s = (0, u.resolveHeadersConstructor)();
              return (t, r) =>
                i(void 0, void 0, void 0, function* () {
                  let o = new s(null == r ? void 0 : r.headers);
                  return (
                    o.has("Authorization") ||
                      o.set("Authorization", `Token ${e}`),
                    n(t, Object.assign(Object.assign({}, r), { headers: o }))
                  );
                });
            }),
            (t.resolveResponse = () =>
              i(void 0, void 0, void 0, function* () {
                return "undefined" == typeof Response
                  ? (yield Promise.resolve().then(() => o(r(4098)))).Response
                  : Response;
              }));
        },
        610: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.convertLegacyOptions =
              t.isDeepgramClientOptions =
              t.isLiveSchema =
              t.buildRequestUrl =
              t.convertProtocolToWs =
              t.CallbackUrl =
              t.isFileSource =
              t.isTextSource =
              t.isUrlSource =
              t.resolveHeadersConstructor =
              t.appendSearchParams =
              t.applyDefaults =
              t.isBun =
              t.isNode =
              t.isBrowser =
              t.stripTrailingSlash =
                void 0);
          const s = r(4098),
            o = n(r(9996)),
            i = r(4678);
          function a(e, t) {
            Object.keys(t).forEach((r) => {
              Array.isArray(t[r])
                ? t[r].forEach((t) => {
                    e.append(r, String(t));
                  })
                : e.append(r, String(t[r]));
            });
          }
          (t.stripTrailingSlash = function (e) {
            return e.replace(/\/$/, "");
          }),
            (t.isBrowser = () => "unknown" !== i.BROWSER_AGENT),
            (t.isNode = () => "unknown" !== i.NODE_VERSION),
            (t.isBun = () => "unknown" !== i.BUN_VERSION),
            (t.applyDefaults = function (e = {}, t = {}) {
              return (0, o.default)(t, e);
            }),
            (t.appendSearchParams = a),
            (t.resolveHeadersConstructor = () =>
              "undefined" == typeof Headers ? s.Headers : Headers),
            (t.isUrlSource = (e) => !!e.url),
            (t.isTextSource = (e) => !!e.text),
            (t.isFileSource = (e) => !(!c(e) && !u(e)));
          const u = (e) => !!e,
            c = (e) => !!e;
          class l extends URL {
            constructor() {
              super(...arguments), (this.callbackUrl = !0);
            }
          }
          (t.CallbackUrl = l),
            (t.convertProtocolToWs = (e) =>
              e.toLowerCase().replace(/^http/, "ws")),
            (t.buildRequestUrl = (e, t, r) => {
              const n = new URL(e, t);
              return a(n.searchParams, r), n;
            }),
            (t.isLiveSchema = function (e) {
              return e && void 0 !== e.interim_results;
            }),
            (t.isDeepgramClientOptions = function (e) {
              return e && void 0 !== e.global;
            }),
            (t.convertLegacyOptions = (e) => {
              var t, r, n, s, i, a;
              const u = {};
              return (
                e._experimentalCustomFetch &&
                  (u.global = {
                    fetch: { client: e._experimentalCustomFetch },
                  }),
                (null === (t = (e = (0, o.default)(e, u)).restProxy) ||
                void 0 === t
                  ? void 0
                  : t.url) &&
                  (u.global = {
                    fetch: {
                      options: {
                        proxy: {
                          url:
                            null === (r = e.restProxy) || void 0 === r
                              ? void 0
                              : r.url,
                        },
                      },
                    },
                  }),
                (null === (n = (e = (0, o.default)(e, u)).global) ||
                void 0 === n
                  ? void 0
                  : n.url) &&
                  (u.global = {
                    fetch: { options: { url: e.global.url } },
                    websocket: { options: { url: e.global.url } },
                  }),
                (null === (s = (e = (0, o.default)(e, u)).global) ||
                void 0 === s
                  ? void 0
                  : s.headers) &&
                  (u.global = {
                    fetch: {
                      options: {
                        headers:
                          null === (i = e.global) || void 0 === i
                            ? void 0
                            : i.headers,
                      },
                    },
                    websocket: {
                      options: {
                        _nodeOnlyHeaders:
                          null === (a = e.global) || void 0 === a
                            ? void 0
                            : a.headers,
                      },
                    },
                  }),
                (0, o.default)(e, u)
              );
            });
        },
        5245: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        2760: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        6871: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        6898: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        9890: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        8816: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        7273: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        7775: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        9880: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        1285: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        8137: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        9535: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        6674: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        9796: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        549: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        7030: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        178: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        5623: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        493: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        1117: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        5310: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        4587: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        13: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        5619: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        5640: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        9628: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        285: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        3513: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        7975: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        2181: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        8084: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        8953: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        4634: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        288: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        627: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        8064: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        7091: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        578: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        2206: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
        },
        6475: function (e, t, r) {
          "use strict";
          var n =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var s = Object.getOwnPropertyDescriptor(t, r);
                    (s &&
                      !("get" in s
                        ? !t.__esModule
                        : s.writable || s.configurable)) ||
                      (s = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, s);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            s =
              (this && this.__exportStar) ||
              function (e, t) {
                for (var r in e)
                  "default" === r ||
                    Object.prototype.hasOwnProperty.call(t, r) ||
                    n(t, e, r);
              };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            s(r(5245), t),
            s(r(2760), t),
            s(r(6871), t),
            s(r(6898), t),
            s(r(9890), t),
            s(r(8816), t),
            s(r(7273), t),
            s(r(7775), t),
            s(r(9880), t),
            s(r(1285), t),
            s(r(8137), t),
            s(r(9535), t),
            s(r(6674), t),
            s(r(9796), t),
            s(r(549), t),
            s(r(7030), t),
            s(r(13), t),
            s(r(178), t),
            s(r(5623), t),
            s(r(493), t),
            s(r(1117), t),
            s(r(5310), t),
            s(r(4587), t),
            s(r(5619), t),
            s(r(5640), t),
            s(r(9628), t),
            s(r(285), t),
            s(r(3513), t),
            s(r(7975), t),
            s(r(2181), t),
            s(r(8084), t),
            s(r(8953), t),
            s(r(4634), t),
            s(r(288), t),
            s(r(627), t),
            s(r(8064), t),
            s(r(7091), t),
            s(r(578), t),
            s(r(2206), t);
        },
        1506: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.version = void 0),
            (t.version = "0.0.0-automated");
        },
        7910: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.AbstractClient = t.noop = void 0);
          const n = r(7187),
            s = r(4678),
            o = r(8752),
            i = r(610);
          t.noop = () => {};
          class a extends n.EventEmitter {
            constructor(e) {
              let r;
              if (
                (super(),
                (this.factory = void 0),
                (this.namespace = "global"),
                (this.version = "v1"),
                (this.baseUrl = s.DEFAULT_URL),
                (this.logger = t.noop),
                "function" == typeof e.key
                  ? ((this.factory = e.key), (r = this.factory()))
                  : (r = e.key),
                r || (r = process.env.DEEPGRAM_API_KEY),
                !r)
              )
                throw new o.DeepgramError("A deepgram API key is required.");
              (this.key = r),
                (e = (0, i.convertLegacyOptions)(e)),
                (this.options = (0, i.applyDefaults)(e, s.DEFAULT_OPTIONS));
            }
            v(e = "v1") {
              return (this.version = e), this;
            }
            get namespaceOptions() {
              const e = (0, i.applyDefaults)(
                this.options[this.namespace],
                this.options.global
              );
              return Object.assign(Object.assign({}, e), { key: this.key });
            }
            getRequestUrl(e, t = { version: this.version }, r) {
              (t.version = this.version),
                (e = e.replace(/:(\w+)/g, function (e, r) {
                  return t[r];
                }));
              const n = new URL(e, this.baseUrl);
              return r && (0, i.appendSearchParams)(n.searchParams, r), n;
            }
            log(e, t, r) {
              this.logger(e, t, r);
            }
          }
          t.AbstractClient = a;
        },
        8403: function (e, t, r) {
          "use strict";
          var n =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var s = Object.getOwnPropertyDescriptor(t, r);
                    (s &&
                      !("get" in s
                        ? !t.__esModule
                        : s.writable || s.configurable)) ||
                      (s = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, s);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            s =
              (this && this.__setModuleDefault) ||
              (Object.create
                ? function (e, t) {
                    Object.defineProperty(e, "default", {
                      enumerable: !0,
                      value: t,
                    });
                  }
                : function (e, t) {
                    e.default = t;
                  }),
            o =
              (this && this.__importStar) ||
              function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                  for (var r in e)
                    "default" !== r &&
                      Object.prototype.hasOwnProperty.call(e, r) &&
                      n(t, e, r);
                return s(t, e), t;
              },
            i =
              (this && this.__awaiter) ||
              function (e, t, r, n) {
                return new (r || (r = Promise))(function (s, o) {
                  function i(e) {
                    try {
                      u(n.next(e));
                    } catch (e) {
                      o(e);
                    }
                  }
                  function a(e) {
                    try {
                      u(n.throw(e));
                    } catch (e) {
                      o(e);
                    }
                  }
                  function u(e) {
                    var t;
                    e.done
                      ? s(e.value)
                      : ((t = e.value),
                        t instanceof r
                          ? t
                          : new r(function (e) {
                              e(t);
                            })).then(i, a);
                  }
                  u((n = n.apply(e, t || [])).next());
                });
              };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.AbstractWsClient = t.AbstractLiveClient = void 0);
          const a = r(7910),
            u = r(4678),
            c = r(610),
            l = "undefined" != typeof WebSocket;
          class h extends a.AbstractClient {
            constructor(e) {
              super(e),
                (this.conn = null),
                (this.sendBuffer = []),
                (this.reconnect = a.noop);
              const {
                key: t,
                websocket: { options: r, client: n },
              } = this.namespaceOptions;
              this.proxy
                ? (this.baseUrl = r.proxy.url)
                : (this.baseUrl = r.url),
                (this.transport = n || null),
                r._nodeOnlyHeaders
                  ? (this.headers = r._nodeOnlyHeaders)
                  : (this.headers = {}),
                "Authorization" in this.headers ||
                  (this.headers.Authorization = `Token ${t}`);
            }
            connect(e, t) {
              if (this.conn) return;
              this.reconnect = (r = e) => {
                this.connect(r, t);
              };
              const n = this.getRequestUrl(t, {}, e);
              if (this.transport)
                this.conn = new this.transport(n, void 0, {
                  headers: this.headers,
                });
              else if ((0, c.isBun)())
                Promise.resolve()
                  .then(() => o(r(7026)))
                  .then(({ default: e }) => {
                    (this.conn = new e(n, { headers: this.headers })),
                      console.log("Using WS package"),
                      this.setupConnection();
                  });
              else {
                if (l)
                  return (
                    (this.conn = new WebSocket(n, [
                      "token",
                      this.namespaceOptions.key,
                    ])),
                    void this.setupConnection()
                  );
                (this.conn = new d(n, void 0, {
                  close: () => {
                    this.conn = null;
                  },
                })),
                  Promise.resolve()
                    .then(() => o(r(7026)))
                    .then(({ default: e }) => {
                      (this.conn = new e(n, void 0, { headers: this.headers })),
                        this.setupConnection();
                    });
              }
            }
            disconnect(e, t) {
              this.conn &&
                ((this.conn.onclose = function () {}),
                e ? this.conn.close(e, null != t ? t : "") : this.conn.close(),
                (this.conn = null));
            }
            connectionState() {
              switch (this.conn && this.conn.readyState) {
                case u.SOCKET_STATES.connecting:
                  return u.CONNECTION_STATE.Connecting;
                case u.SOCKET_STATES.open:
                  return u.CONNECTION_STATE.Open;
                case u.SOCKET_STATES.closing:
                  return u.CONNECTION_STATE.Closing;
                default:
                  return u.CONNECTION_STATE.Closed;
              }
            }
            getReadyState() {
              var e, t;
              return null !==
                (t =
                  null === (e = this.conn) || void 0 === e
                    ? void 0
                    : e.readyState) && void 0 !== t
                ? t
                : u.SOCKET_STATES.closed;
            }
            isConnected() {
              return this.connectionState() === u.CONNECTION_STATE.Open;
            }
            send(e) {
              const t = () =>
                i(this, void 0, void 0, function* () {
                  var t;
                  if (e instanceof Blob) {
                    if (0 === e.size)
                      return void this.log(
                        "warn",
                        "skipping `send` for zero-byte blob",
                        e
                      );
                    e = yield e.arrayBuffer();
                  }
                  "string" == typeof e || 0 !== e.byteLength
                    ? null === (t = this.conn) || void 0 === t || t.send(e)
                    : this.log("warn", "skipping `send` for zero-byte blob", e);
                });
              this.isConnected() ? t() : this.sendBuffer.push(t);
            }
            get proxy() {
              var e;
              return (
                "proxy" === this.key &&
                !!(null ===
                  (e = this.namespaceOptions.websocket.options.proxy) ||
                void 0 === e
                  ? void 0
                  : e.url)
              );
            }
          }
          (t.AbstractLiveClient = h), (t.AbstractWsClient = h);
          class d {
            constructor(e, t, r) {
              (this.binaryType = "arraybuffer"),
                (this.onclose = () => {}),
                (this.onerror = () => {}),
                (this.onmessage = () => {}),
                (this.onopen = () => {}),
                (this.readyState = u.SOCKET_STATES.connecting),
                (this.send = () => {}),
                (this.url = null),
                (this.url = e.toString()),
                (this.close = r.close);
            }
          }
        },
        5462: function (e, t, r) {
          "use strict";
          var n =
              (this && this.__awaiter) ||
              function (e, t, r, n) {
                return new (r || (r = Promise))(function (s, o) {
                  function i(e) {
                    try {
                      u(n.next(e));
                    } catch (e) {
                      o(e);
                    }
                  }
                  function a(e) {
                    try {
                      u(n.throw(e));
                    } catch (e) {
                      o(e);
                    }
                  }
                  function u(e) {
                    var t;
                    e.done
                      ? s(e.value)
                      : ((t = e.value),
                        t instanceof r
                          ? t
                          : new r(function (e) {
                              e(t);
                            })).then(i, a);
                  }
                  u((n = n.apply(e, t || [])).next());
                });
              },
            s =
              (this && this.__importDefault) ||
              function (e) {
                return e && e.__esModule ? e : { default: e };
              };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.AbstractRestfulClient = t.AbstractRestClient = void 0);
          const o = r(8752),
            i = r(8716),
            a = r(7910),
            u = r(610),
            c = s(r(9996));
          class l extends a.AbstractClient {
            constructor(e) {
              if ((super(e), (0, u.isBrowser)() && !this.proxy))
                throw new o.DeepgramError(
                  "Due to CORS we are unable to support REST-based API calls to our API from the browser. Please consider using a proxy: https://dpgr.am/js-proxy for more information."
                );
              (this.fetch = (0, i.fetchWithAuth)(
                this.key,
                this.namespaceOptions.fetch.client
              )),
                this.proxy
                  ? (this.baseUrl =
                      this.namespaceOptions.fetch.options.proxy.url)
                  : (this.baseUrl = this.namespaceOptions.fetch.options.url);
            }
            _getErrorMessage(e) {
              return (
                e.msg ||
                e.message ||
                e.error_description ||
                e.error ||
                JSON.stringify(e)
              );
            }
            _handleError(e, t) {
              return n(this, void 0, void 0, function* () {
                const r = yield (0, i.resolveResponse)();
                e instanceof r
                  ? e
                      .json()
                      .then((r) => {
                        t(
                          new o.DeepgramApiError(
                            this._getErrorMessage(r),
                            e.status || 500
                          )
                        );
                      })
                      .catch((e) => {
                        t(
                          new o.DeepgramUnknownError(
                            this._getErrorMessage(e),
                            e
                          )
                        );
                      })
                  : t(new o.DeepgramUnknownError(this._getErrorMessage(e), e));
              });
            }
            _getRequestOptions(e, t, r) {
              let n = { method: e };
              return (
                (n =
                  "GET" === e || "DELETE" === e
                    ? Object.assign(Object.assign({}, n), t)
                    : Object.assign(
                        Object.assign({ duplex: "half", body: t }, n),
                        r
                      )),
                (0, c.default)(this.namespaceOptions.fetch.options, n, {
                  clone: !1,
                })
              );
            }
            _handleRequest(e, t, r, s) {
              return n(this, void 0, void 0, function* () {
                return new Promise((n, o) => {
                  (0, this.fetch)(t, this._getRequestOptions(e, r, s))
                    .then((e) => {
                      if (!e.ok) throw e;
                      n(e);
                    })
                    .catch((e) => this._handleError(e, o));
                });
              });
            }
            get(e, t) {
              return n(this, void 0, void 0, function* () {
                return this._handleRequest("GET", e, t);
              });
            }
            post(e, t, r) {
              return n(this, void 0, void 0, function* () {
                return this._handleRequest("POST", e, t, r);
              });
            }
            put(e, t, r) {
              return n(this, void 0, void 0, function* () {
                return this._handleRequest("PUT", e, t, r);
              });
            }
            patch(e, t, r) {
              return n(this, void 0, void 0, function* () {
                return this._handleRequest("PATCH", e, t, r);
              });
            }
            delete(e, t) {
              return n(this, void 0, void 0, function* () {
                return this._handleRequest("DELETE", e, t);
              });
            }
            get proxy() {
              var e;
              return (
                "proxy" === this.key &&
                !!(null === (e = this.namespaceOptions.fetch.options.proxy) ||
                void 0 === e
                  ? void 0
                  : e.url)
              );
            }
          }
          (t.AbstractRestClient = l), (t.AbstractRestfulClient = l);
        },
        5685: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ListenClient = void 0);
          const n = r(7910),
            s = r(5669),
            o = r(3914);
          class i extends n.AbstractClient {
            constructor() {
              super(...arguments), (this.namespace = "listen");
            }
            get prerecorded() {
              return new o.ListenRestClient(this.options);
            }
            live(e = {}, t = ":version/listen") {
              return new s.ListenLiveClient(this.options, e, t);
            }
          }
          t.ListenClient = i;
        },
        5669: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.LiveClient = t.ListenLiveClient = void 0);
          const n = r(8403),
            s = r(57);
          class o extends n.AbstractLiveClient {
            constructor(e, t = {}, r = ":version/listen") {
              super(e), (this.namespace = "listen"), this.connect(t, r);
            }
            setupConnection() {
              this.conn &&
                ((this.conn.onopen = () => {
                  this.emit(s.LiveTranscriptionEvents.Open, this);
                }),
                (this.conn.onclose = (e) => {
                  this.emit(s.LiveTranscriptionEvents.Close, e);
                }),
                (this.conn.onerror = (e) => {
                  this.emit(s.LiveTranscriptionEvents.Error, e);
                }),
                (this.conn.onmessage = (e) => {
                  try {
                    const t = JSON.parse(e.data.toString());
                    t.type === s.LiveTranscriptionEvents.Metadata
                      ? this.emit(s.LiveTranscriptionEvents.Metadata, t)
                      : t.type === s.LiveTranscriptionEvents.Transcript
                      ? this.emit(s.LiveTranscriptionEvents.Transcript, t)
                      : t.type === s.LiveTranscriptionEvents.UtteranceEnd
                      ? this.emit(s.LiveTranscriptionEvents.UtteranceEnd, t)
                      : t.type === s.LiveTranscriptionEvents.SpeechStarted
                      ? this.emit(s.LiveTranscriptionEvents.SpeechStarted, t)
                      : this.emit(s.LiveTranscriptionEvents.Unhandled, t);
                  } catch (t) {
                    this.emit(s.LiveTranscriptionEvents.Error, {
                      event: e,
                      message: "Unable to parse `data` as JSON.",
                      error: t,
                    });
                  }
                }));
            }
            configure(e) {
              this.send(JSON.stringify({ type: "Configure", processors: e }));
            }
            keepAlive() {
              this.send(JSON.stringify({ type: "KeepAlive" }));
            }
            finalize() {
              this.send(JSON.stringify({ type: "Finalize" }));
            }
            finish() {
              this.requestClose();
            }
            requestClose() {
              this.send(JSON.stringify({ type: "CloseStream" }));
            }
          }
          (t.ListenLiveClient = o), (t.LiveClient = o);
        },
        3914: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, o) {
                function i(e) {
                  try {
                    u(n.next(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function u(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(i, a);
                }
                u((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.PrerecordedClient = t.ListenRestClient = void 0);
          const s = r(610),
            o = r(8752),
            i = r(5462);
          class a extends i.AbstractRestClient {
            constructor() {
              super(...arguments), (this.namespace = "listen");
            }
            transcribeUrl(e, t, r = ":version/listen") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, s.isUrlSource)(e))
                    throw new o.DeepgramError(
                      "Unknown transcription source type"
                    );
                  if (
                    ((n = JSON.stringify(e)), void 0 !== t && "callback" in t)
                  )
                    throw new o.DeepgramError(
                      "Callback cannot be provided as an option to a synchronous transcription. Use `transcribeUrlCallback` or `transcribeFileCallback` instead."
                    );
                  const i = this.getRequestUrl(r, {}, Object.assign({}, t));
                  return {
                    result: yield this.post(i, n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, o.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            transcribeFile(e, t, r = ":version/listen") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, s.isFileSource)(e))
                    throw new o.DeepgramError(
                      "Unknown transcription source type"
                    );
                  if (((n = e), void 0 !== t && "callback" in t))
                    throw new o.DeepgramError(
                      "Callback cannot be provided as an option to a synchronous transcription. Use `transcribeUrlCallback` or `transcribeFileCallback` instead."
                    );
                  const i = this.getRequestUrl(r, {}, Object.assign({}, t));
                  return {
                    result: yield this.post(i, n, {
                      headers: { "Content-Type": "deepgram/audio+video" },
                    }).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, o.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            transcribeUrlCallback(e, t, r, i = ":version/listen") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, s.isUrlSource)(e))
                    throw new o.DeepgramError(
                      "Unknown transcription source type"
                    );
                  n = JSON.stringify(e);
                  const a = this.getRequestUrl(
                    i,
                    {},
                    Object.assign(Object.assign({}, r), {
                      callback: t.toString(),
                    })
                  );
                  return {
                    result: yield this.post(a, n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, o.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            transcribeFileCallback(e, t, r, i = ":version/listen") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, s.isFileSource)(e))
                    throw new o.DeepgramError(
                      "Unknown transcription source type"
                    );
                  n = e;
                  const a = this.getRequestUrl(
                    i,
                    {},
                    Object.assign(Object.assign({}, r), {
                      callback: t.toString(),
                    })
                  );
                  return {
                    result: yield this.post(a, n, {
                      headers: { "Content-Type": "deepgram/audio+video" },
                    }).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, o.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
          }
          (t.ListenRestClient = a), (t.PrerecordedClient = a);
        },
        4522: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, o) {
                function i(e) {
                  try {
                    u(n.next(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function u(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(i, a);
                }
                u((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ManageClient = t.ManageRestClient = void 0);
          const s = r(8752),
            o = r(5462);
          class i extends o.AbstractRestClient {
            constructor() {
              super(...arguments), (this.namespace = "manage");
            }
            getTokenDetails(e = ":version/auth/token") {
              return n(this, void 0, void 0, function* () {
                try {
                  const t = this.getRequestUrl(e);
                  return {
                    result: yield this.get(t).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjects(e = ":version/projects") {
              return n(this, void 0, void 0, function* () {
                try {
                  const t = this.getRequestUrl(e);
                  return {
                    result: yield this.get(t).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProject(e, t = ":version/projects/:projectId") {
              return n(this, void 0, void 0, function* () {
                try {
                  const r = this.getRequestUrl(t, { projectId: e });
                  return {
                    result: yield this.get(r).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            updateProject(e, t, r = ":version/projects/:projectId") {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e }, t),
                    s = JSON.stringify(t);
                  return {
                    result: yield this.patch(n, s).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            deleteProject(e, t = ":version/projects/:projectId") {
              return n(this, void 0, void 0, function* () {
                try {
                  const r = this.getRequestUrl(t, { projectId: e });
                  return yield this.delete(r), { error: null };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e)) return { error: e };
                  throw e;
                }
              });
            }
            getProjectKeys(e, t = ":version/projects/:projectId/keys") {
              return n(this, void 0, void 0, function* () {
                try {
                  const r = this.getRequestUrl(t, { projectId: e });
                  return {
                    result: yield this.get(r).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjectKey(
              e,
              t,
              r = ":version/projects/:projectId/keys/:keyId"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e, keyId: t });
                  return {
                    result: yield this.get(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            createProjectKey(e, t, r = ":version/projects/:projectId/keys") {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e }, t),
                    s = JSON.stringify(t);
                  return {
                    result: yield this.post(n, s).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            deleteProjectKey(
              e,
              t,
              r = ":version/projects/:projectId/keys/:keyId"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e, keyId: t });
                  return yield this.delete(n), { error: null };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e)) return { error: e };
                  throw e;
                }
              });
            }
            getProjectMembers(e, t = ":version/projects/:projectId/members") {
              return n(this, void 0, void 0, function* () {
                try {
                  const r = this.getRequestUrl(t, { projectId: e });
                  return {
                    result: yield this.get(r).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            removeProjectMember(
              e,
              t,
              r = ":version/projects/:projectId/members/:memberId"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, {
                    projectId: e,
                    memberId: t,
                  });
                  return yield this.delete(n), { error: null };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e)) return { error: e };
                  throw e;
                }
              });
            }
            getProjectMemberScopes(
              e,
              t,
              r = ":version/projects/:projectId/members/:memberId/scopes"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, {
                    projectId: e,
                    memberId: t,
                  });
                  return {
                    result: yield this.get(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            updateProjectMemberScope(
              e,
              t,
              r,
              o = ":version/projects/:projectId/members/:memberId/scopes"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(
                      o,
                      { projectId: e, memberId: t },
                      r
                    ),
                    s = JSON.stringify(r);
                  return {
                    result: yield this.put(n, s).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjectInvites(e, t = ":version/projects/:projectId/invites") {
              return n(this, void 0, void 0, function* () {
                try {
                  const r = this.getRequestUrl(t, { projectId: e });
                  return {
                    result: yield this.get(r).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            sendProjectInvite(
              e,
              t,
              r = ":version/projects/:projectId/invites"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e }, t),
                    s = JSON.stringify(t);
                  return {
                    result: yield this.post(n, s).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            deleteProjectInvite(
              e,
              t,
              r = ":version/projects/:projectId/invites/:email"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e, email: t });
                  return (
                    yield this.delete(n).then((e) => e.json()), { error: null }
                  );
                } catch (e) {
                  if ((0, s.isDeepgramError)(e)) return { error: e };
                  throw e;
                }
              });
            }
            leaveProject(e, t = ":version/projects/:projectId/leave") {
              return n(this, void 0, void 0, function* () {
                try {
                  const r = this.getRequestUrl(t, { projectId: e });
                  return {
                    result: yield this.delete(r).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjectUsageRequests(
              e,
              t,
              r = ":version/projects/:projectId/requests"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e }, t);
                  return {
                    result: yield this.get(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjectUsageRequest(
              e,
              t,
              r = ":version/projects/:projectId/requests/:requestId"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, {
                    projectId: e,
                    requestId: t,
                  });
                  return {
                    result: yield this.get(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjectUsageSummary(
              e,
              t,
              r = ":version/projects/:projectId/usage"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e }, t);
                  return {
                    result: yield this.get(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjectUsageFields(
              e,
              t,
              r = ":version/projects/:projectId/usage/fields"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e }, t);
                  return {
                    result: yield this.get(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjectBalances(e, t = ":version/projects/:projectId/balances") {
              return n(this, void 0, void 0, function* () {
                try {
                  const r = this.getRequestUrl(t, { projectId: e });
                  return {
                    result: yield this.get(r).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getProjectBalance(
              e,
              t,
              r = ":version/projects/:projectId/balances/:balanceId"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, {
                    projectId: e,
                    balanceId: t,
                  });
                  return {
                    result: yield this.get(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
          }
          (t.ManageRestClient = i), (t.ManageClient = i);
        },
        9766: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, o) {
                function i(e) {
                  try {
                    u(n.next(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function u(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(i, a);
                }
                u((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ReadClient = t.ReadRestClient = void 0);
          const s = r(610),
            o = r(8752),
            i = r(5462);
          class a extends i.AbstractRestClient {
            constructor() {
              super(...arguments), (this.namespace = "read");
            }
            analyzeUrl(e, t, r = ":version/read") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, s.isUrlSource)(e))
                    throw new o.DeepgramError("Unknown source type");
                  if (
                    ((n = JSON.stringify(e)), void 0 !== t && "callback" in t)
                  )
                    throw new o.DeepgramError(
                      "Callback cannot be provided as an option to a synchronous transcription. Use `analyzeUrlCallback` or `analyzeTextCallback` instead."
                    );
                  const i = this.getRequestUrl(r, {}, Object.assign({}, t));
                  return {
                    result: yield this.post(i, n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, o.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            analyzeText(e, t, r = ":version/read") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, s.isTextSource)(e))
                    throw new o.DeepgramError("Unknown source type");
                  if (
                    ((n = JSON.stringify(e)), void 0 !== t && "callback" in t)
                  )
                    throw new o.DeepgramError(
                      "Callback cannot be provided as an option to a synchronous requests. Use `analyzeUrlCallback` or `analyzeTextCallback` instead."
                    );
                  const i = this.getRequestUrl(r, {}, Object.assign({}, t));
                  return {
                    result: yield this.post(i, n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, o.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            analyzeUrlCallback(e, t, r, i = ":version/read") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, s.isUrlSource)(e))
                    throw new o.DeepgramError("Unknown source type");
                  n = JSON.stringify(e);
                  const a = this.getRequestUrl(
                    i,
                    {},
                    Object.assign(Object.assign({}, r), {
                      callback: t.toString(),
                    })
                  );
                  return {
                    result: yield this.post(a, n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, o.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            analyzeTextCallback(e, t, r, i = ":version/read") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, s.isTextSource)(e))
                    throw new o.DeepgramError("Unknown source type");
                  n = JSON.stringify(e);
                  const a = this.getRequestUrl(
                    i,
                    {},
                    Object.assign(Object.assign({}, r), {
                      callback: t.toString(),
                    })
                  );
                  return {
                    result: yield this.post(a, n, {
                      headers: { "Content-Type": "deepgram/audio+video" },
                    }).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, o.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
          }
          (t.ReadRestClient = a), (t.ReadClient = a);
        },
        2164: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, o) {
                function i(e) {
                  try {
                    u(n.next(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function u(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(i, a);
                }
                u((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.OnPremClient = t.SelfHostedRestClient = void 0);
          const s = r(8752),
            o = r(5462);
          class i extends o.AbstractRestClient {
            constructor() {
              super(...arguments), (this.namespace = "selfhosted");
            }
            listCredentials(
              e,
              t = ":version/projects/:projectId/onprem/distribution/credentials"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const r = this.getRequestUrl(t, { projectId: e });
                  return {
                    result: yield this.get(r).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            getCredentials(
              e,
              t,
              r = ":version/projects/:projectId/onprem/distribution/credentials/:credentialsId"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, {
                    projectId: e,
                    credentialsId: t,
                  });
                  return {
                    result: yield this.get(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            createCredentials(
              e,
              t,
              r = ":version/projects/:projectId/onprem/distribution/credentials"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, { projectId: e }),
                    s = JSON.stringify(t);
                  return {
                    result: yield this.post(n, s).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
            deleteCredentials(
              e,
              t,
              r = ":version/projects/:projectId/onprem/distribution/credentials/:credentialsId"
            ) {
              return n(this, void 0, void 0, function* () {
                try {
                  const n = this.getRequestUrl(r, {
                    projectId: e,
                    credentialsId: t,
                  });
                  return {
                    result: yield this.delete(n).then((e) => e.json()),
                    error: null,
                  };
                } catch (e) {
                  if ((0, s.isDeepgramError)(e))
                    return { result: null, error: e };
                  throw e;
                }
              });
            }
          }
          (t.SelfHostedRestClient = i), (t.OnPremClient = i);
        },
        9111: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, o) {
                function i(e) {
                  try {
                    u(n.next(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function a(e) {
                  try {
                    u(n.throw(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function u(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(i, a);
                }
                u((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.SpeakClient = t.SpeakRestClient = void 0);
          const s = r(8752),
            o = r(610),
            i = r(5462);
          class a extends i.AbstractRestClient {
            constructor() {
              super(...arguments), (this.namespace = "speak");
            }
            request(e, t, r = ":version/speak") {
              return n(this, void 0, void 0, function* () {
                try {
                  let n;
                  if (!(0, o.isTextSource)(e))
                    throw new s.DeepgramError(
                      "Unknown transcription source type"
                    );
                  n = JSON.stringify(e);
                  const i = this.getRequestUrl(
                    r,
                    {},
                    Object.assign({ model: "aura-asteria-en" }, t)
                  );
                  return (
                    (this.result = yield this.post(i, n, {
                      headers: {
                        Accept: "audio/*",
                        "Content-Type": "application/json",
                      },
                    })),
                    this
                  );
                } catch (e) {
                  throw e;
                }
              });
            }
            getStream() {
              return n(this, void 0, void 0, function* () {
                if (!this.result)
                  throw new s.DeepgramUnknownError(
                    "Tried to get stream before making request",
                    ""
                  );
                return this.result.body;
              });
            }
            getHeaders() {
              return n(this, void 0, void 0, function* () {
                if (!this.result)
                  throw new s.DeepgramUnknownError(
                    "Tried to get headers before making request",
                    ""
                  );
                return this.result.headers;
              });
            }
          }
          (t.SpeakRestClient = a), (t.SpeakClient = a);
        },
        8458: function (e, t, r) {
          "use strict";
          var n =
              (this && this.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var s = Object.getOwnPropertyDescriptor(t, r);
                    (s &&
                      !("get" in s
                        ? !t.__esModule
                        : s.writable || s.configurable)) ||
                      (s = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, s);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            s =
              (this && this.__exportStar) ||
              function (e, t) {
                for (var r in e)
                  "default" === r ||
                    Object.prototype.hasOwnProperty.call(t, r) ||
                    n(t, e, r);
              };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            s(r(7910), t),
            s(r(8403), t),
            s(r(5462), t),
            s(r(5685), t),
            s(r(5669), t),
            s(r(3914), t),
            s(r(4522), t),
            s(r(9766), t),
            s(r(2164), t),
            s(r(9111), t);
        },
        7026: (e) => {
          "use strict";
          e.exports = function () {
            throw new Error(
              "ws does not work in the browser. Browser clients must use the native WebSocket object"
            );
          };
        },
      },
      t = {};
    function r(n) {
      var s = t[n];
      if (void 0 !== s) return s.exports;
      var o = (t[n] = { exports: {} });
      return e[n].call(o.exports, o, o.exports, r), o.exports;
    }
    return (
      (r.n = (e) => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return r.d(t, { a: t }), t;
      }),
      (r.d = (e, t) => {
        for (var n in t)
          r.o(t, n) &&
            !r.o(e, n) &&
            Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
      }),
      (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
      (r.r = (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      r(341)
    );
  })()
);
