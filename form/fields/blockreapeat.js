/**
 * @package		Joomla.JavaScript
 * @copyright	Copyright (C) 2005 - 2014 Open Source Matters, Inc. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 */ (function(e) {
    "use strict";
    e.JBlockrepeat = function(t, n) {
        var r = this;
        if (!r || r === window) return new e.JBlockrepeat(t, n);
        r.$input = e(t);
        if (r.$input.data("JBlockrepeat")) return r;
        r.$input.data("JBlockrepeat", r), r.init = function() {
            r.options = e.extend({}, e.JBlockrepeat.defaults, n), r.$container = e(r.options.container), e("body").append(r.$container), r.$rowsContainer = r.$container.find(r.options.blockrepeatElement).parent(), r.prepareModal(), r.inputs = [], r.values = {}, r.prepareTemplate();
            var t = r.$input.val();
            if (t) try {
                r.values = JSON.parse(t)
            } catch (i) {
                if (i instanceof SyntaxError) try {
                    t = t.replace(/'/g, '"').replace(/\\"/g, "'"), r.values = JSON.parse(t)
                } catch (i) {
                    window.console && console.log(i)
                } else window.console && console.log(i)
            }
            r.buildRows(), e(document).on("click", r.options.btModalOpen, function(e) {
                e.preventDefault(), r.$modalWindow.modal("show")
            }), r.$modalWindow.on("click", r.options.btModalClose, function(e) {
                e.preventDefault(), r.$modalWindow.modal("hide"), r.buildRows()
            }), r.$modalWindow.on("click", r.options.btModalSaveData, function(e) {
                e.preventDefault(), r.$modalWindow.modal("hide"), r.refreshValue()
            }), r.$container.on("click", r.options.btAdd, function(t) {
                t.preventDefault();
                var n = e(this).parents(r.options.blockrepeatElement);
                n.length || (n = null), r.addRow(n)
            }), r.$container.on("click", r.options.btRemove, function(t) {
                t.preventDefault();
                var n = e(this).parents(r.options.blockrepeatElement);
                r.removeRow(n)
            }), r.$input.trigger("weready")
        }, r.prepareTemplate = function() {
            var t = r.$container.find(r.options.blockrepeatElement),
                n = e(t.get(0));
            try {
                r.clearScripts(n)
            } catch (i) {
                window.console && console.log(i)
            }
            var s = n.find("*[name]");
            for (var o = 0, u = s.length; o < u; o++) {
                var a = e(s[o]).attr("name");
                if (r.values[a]) continue;
                r.inputs.push({
                    name: a,
                    type: e(s[o]).attr("type") || s[o].tagName.toLowerCase()
                }), r.values[a] = []
            }
            r.template = n.prop("outerHTML"), t.remove(), r.$input.trigger("prepare-template", r.template)
        }, r.prepareModal = function() {
            var t = e(r.options.modalElement);
            t.css({
                position: "absolute",
                width: "auto",
                "max-width": "100%"
            }), t.on("shown", function() {
                r.resizeModal()
            }), e(window).resize(function() {
                r.resizeModal()
            }), r.$modalWindow = t.modal({
                show: !1,
                backdrop: "static"
            }), r.$input.trigger("prepare-modal", r.$modalWindow)
        }, r.resizeModal = function() {
            if (!r.$modalWindow.is(":visible")) return;
            var t = e(document).width() / 2,
                n = r.$modalWindow.width() / 2,
                i = r.$rowsContainer.width() / 2,
                s = n >= t ? 0 : -n,
                o = s ? "50%" : 0,
                u = e(document).scrollTop() + e(window).height() * .2;
            r.$modalWindow.css({
                top: u,
                left: o,
                "margin-left": s,
                overflow: i > n ? "auto" : "visible"
            })
        }, r.buildRows = function() {
            var e = r.$rowsContainer.children();
            e.length && r.removeRow(e);
            var t = r.inputs[0],
                n = r.values[t.name].length || 1,
                i = null;
            for (var s = 0; s < n; s++) i = r.addRow(i, s)
        }, r.addRow = function(t, n) {
            var i = r.$container.find(r.options.blockrepeatElement).length;
            if (i >= r.options.maximum) return null;
            var s = e.parseHTML(r.template);
            t ? e(t).after(s) : r.$rowsContainer.append(s);
            var o = e(s);
            r.fixUniqueAttributes(o, i + 1);
            if (n !== null && n !== undefined) for (var u = 0, a = r.inputs.length; u < a; u++) {
                var f = r.inputs[u].name,
                    l = r.inputs[u].type,
                    c = null;
                r.values[f] && (c = r.values[f][n]);
                if (c === null || c === undefined) continue;
                if (l === "radio") o.find('*[name*="' + f + '"][value="' + c + '"]').attr("checked", "checked");
                else if (l === "checkbox") if (c.length) for (var h = 0, p = c.length; h < p; h++) o.find('*[name*="' + f + '"][value="' + c[h] + '"]').attr("checked", "checked");
                else o.find('*[name*="' + f + '"][value="' + c + '"]').attr("checked", "checked");
                else o.find('*[name*="' + f + '"]').val(c)
            }
            try {
                r.fixScripts(o)
            } catch (d) {
                window.console && console.log(d)
            }
            return r.$input.trigger("row-add", o), o
        }, r.removeRow = function(t) {
            r.$input.trigger("row-remove", t), e(t).remove()
        }, r.fixUniqueAttributes = function(e, t) {
            var n = e.find("*[id]");
            r.incresseAttrName(n, "id", t);
            var i = e.find("label[for]");
            r.incresseAttrName(i, "for", t);
            var s = e.find("*[name]");
            r.incresseAttrName(s, "name", t)
        }, r.incresseAttrName = function(t, n, r) {
            for (var i = 0, s = t.length; i < s; i++) {
                var o = e(t[i]),
                    u = o.attr(n);
                o.attr(n, u + "-" + r)
            }
        }, r.refreshValue = function() {
            var t = r.$container.find(r.options.blockrepeatElement);
            r.values = {};
            for (var n = 0, i = r.inputs.length; n < i; n++) {
                var s = r.inputs[n].name,
                    o = r.inputs[n].type;
                r.values[s] = [];
                for (var u = 0, a = t.length; u < a; u++) {
                    var f = e(t[u]),
                        l = null;
                    if (o === "radio") l = f.find('*[name*="' + s + '"]:checked').val();
                    else if (o === "checkbox") {
                        var c = f.find('*[name*="' + s + '"]:checked');
                        if (c.length > 1) {
                            l = [];
                            for (var h = 0, p = c.length; h < p; h++) l.push(e(c[h]).val())
                        } else l = c.val()
                    } else l = f.find('*[name*="' + s + '"]').val();
                    l = l === null ? "" : l, r.values[s].push(l)
                }
            }
            r.$input.val(JSON.stringify(r.values)), r.$input.trigger("value-update", r.values)
        }, r.clearScripts = function(t) {
            e.fn.chosen && t.find("select.chzn-done").chosen("destroy"), e.fn.minicolors && (t.find(".minicolors input").each(function() {
                e(this).removeData("minicolors-initialized").removeData("minicolors-settings").removeProp("size").removeProp("maxlength").removeClass("minicolors-input").parents("span.minicolors").parent().append(this)
            }), t.find("span.minicolors").remove())
        }, r.fixScripts = function(t) {
            e.fn.chosen && t.find("select").chosen(), t.find(".minicolors").each(function() {
                var t = e(this);
                t.minicolors({
                    control: t.attr("data-control") || "hue",
                    position: t.attr("data-position") || "right",
                    theme: "bootstrap"
                })
            }), t.find('a[onclick*="jInsertFieldValue"]').each(function() {
                var t = e(this),
                    n = t.siblings('input[type="text"]').attr("id"),
                    r = t.prev(),
                    i = r.attr("href");
                t.attr("onclick", "jInsertFieldValue('', '" + n + "');return false;"), r.attr("href", i.replace(/&fieldid=(.+)&/, "&fieldid=" + n + "&"))
            }), window.SqueezeBox && SqueezeBox.assign(t.find("a.modal").get(), {
                parse: "rel"
            })
        }, r.init()
    }, e.JBlockrepeat.defaults = {
        modalElement: "#modal-container",
        btModalOpen: "#open-modal",
        btModalClose: ".close-modal",
        btModalSaveData: ".save-modal-data",
        btAdd: "a.add",
        btRemove: "a.remove",
        maximum: 10,
        blockrepeatElement: "table tbody tr"
    }, e.fn.JBlockrepeat = function(t) {
        return this.each(function() {
            var t = t || {}, n = e(this).data();
            for (var r in n) n.hasOwnProperty(r) && (t[r] = n[r]);
            new e.JBlockrepeat(this, t)
        })
    }, e(window).on("load", function() {
        e("input.form-field-blockrepeat").JBlockrepeat()
    })
})(jQuery);
