(function () {
    var holdreflash = function (opts) {
            try {
                if (!opts.target || !opts.insertf || !opts.insert || !opts.item) {
                    throw new Error("元素不齐全，无法运行！");
                }
            } catch (e) {
                console.error(e.message);
                return false;
            }
            this.target = document.querySelector(opts.target);
            this.insertf = document.querySelector(opts.insertf);
            this.insert = this.insertf.querySelectorAll(opts.insert)[0];
            this.item = opts.item;
            this.headrelease = opts.headrelease || function () {};
            this.footrelease = opts.footrelease || function () {};
            this.headonly = opts.headonly || 0;
            this.footonly = opts.footonly || 0;
            this.drag = {};
            this.pos = 0;
            this.init();
            this.events();
            this.dragable = 1;
        },
        style = {
            stage: function (o) {
                o.style.cssText += "position: relative;overflow: hidden;";
            },
            insertf: function (o) {
                o.style.cssText = "-webkit-transition: all 1s;-moz-transition:all 1s;transition:all 1s;position: absolute;top:0px;left:0px;z-index:9;overflow-y: scroll;-webkit-overflow-scrolling: touch;";
            },
            loading: function (o) {
                o.style.cssText = "text-align:center;padding:8px 0;width:100%;position:absolute;z-index:1;left:0px;display:none;-webkit-transition: all 1s;-moz-transition:all 1s;transition:all 1s;";
            },
            loadingImg: "data:image/gif;base64,R0lGODlhEAAQALMPAHp6evf394qKiry8vJOTk83NzYKCgubm5t7e3qysrMXFxe7u7pubm7S0tKOjo////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCAAPACwAAAAAEAAQAAAETPDJSau9NRDAgWxDYGmdZADCkQnlU7CCOA3oNgXsQG2FRhUAAoWDIU6MGeSDR0m4ghRa7JjIUXCogqQzpRxYhi2HILsOGuJxGcNuTyIAIfkECQgADwAsAAAAABAAEAAABGLwSXmMmjhLAQjSWDAYQHmAz8GVQPIESxZwggIYS0AIATYAvAdh8OIQJwRAQbJkdjAlUCA6KfU0VEmyGWgWnpNfcEAoAo6SmWtBUtCuk9gjwQKeQAeWYQAHIZICKBoKBncTEQAh+QQJCAAPACwAAAAAEAAQAAAEWvDJORejGCtQsgwDAQAGGWSHMK7jgAWq0CGj0VEDIJxPnvAU0a13eAQKrsnI81gqAZ6AUzIonA7JRwFAyAQSgCQsjCmUAIhjDEhlrQTFV+lMGLApWwUzw1jsIwAh+QQJCAAPACwAAAAAEAAQAAAETvDJSau9L4QaBgEAMWgEQh0CqALCZ0pBKhRSkYLvM7Ab/OGThoE2+QExyAdiuexhVglKwdCgqKKTGGBgBc00Np7VcVsJDpVo5ydyJt/wCAAh+QQJCAAPACwAAAAAEAAQAAAEWvDJSau9OAwCABnBtQhdCQjHlQhFWJBCOKWPLAXk8KQIkCwWBcAgMDw4Q5CkgOwohCVCYTIwdAgPolVhWSQAiN1jcLLVQrQbrBV4EcySA8l0Alo0yA8cw+9TIgAh+QQFCAAPACwAAAAAEAAQAAAEWvDJSau9WA4AyAhWMChPwXHCQRUGYARgKQBCzJxAQgXzIC2KFkc1MREoHMTAhwQ0Y5oBgkMhAAqUw8mgWGho0EcCx5DwaAUQrGXATg6zE7bwCQ2sAGZmz7dEAAA7",
            succImg: "data:image/gif;base64,R0lGODlhEAAQALMAAACZAF+/X8/szx6lHp/Zn4/SjxCfEO/576/frzCsMJTWlP///wAAAAAAAAAAAAAAACH5BAEHAAsALAAAAAAQABAAAAQ1cMlJq704ayoG2otgAAY4GgJ1WAkAfFOXTi1AVCdc3xUxAoUdRuRyFTREQAB0SCxB0KhUEgEAOw==",
            failImg: "data:image/gif;base64,R0lGODlhEAAQALMAAP8AAP+vr/9fX/8YGP+fn//f3/+Pj/8PD//MzP8zM/+/v/8JCf8fH////wAAAAAAACH5BAEHAA0ALAAAAAAQABAAAARDsMlJq704W0EqEVZxAMGkAEdhISjSIKN7EQBTMECXGcACGBoJjhFs8AY/DS1RSOQwsFRDdJBRqNao6spQVBS2olgTAQA7"
        };
    holdreflash.prototype.fix = function () {
        var self = this;
        self.items = self.target.querySelectorAll(self.item);
        self.first = self.items[0];
        self.last = self.items[self.items.length - 1];
        self.pos = 0;
        self.drag = {};
        self.dragable = 1;
        self.firstTime = 0;
        self.fail = 0;
        self.insertf.style.top = "0px";
        loadingRollback(self.fLoading);
        loadingRollback(self.lLoading);
    };
    holdreflash.prototype.init = function () {
        var self = this;
        style.stage(self.target);
        style.insertf(self.insertf);
        self.fLoading = loading(self.insertf, self.target, 1);
        self.lLoading = loading(self.insertf, self.target, 0);
        self.fix();
    };
    holdreflash.prototype.events = function () {
        var self = this;
        self.insertf.addEventListener("touchstart", function (e) {
            if (self.dragable == 1) {
                var bottom = self.insert.clientHeight - self.insertf.clientHeight;
                if (self.insertf.scrollTop == 0 || self.insertf.scrollTop == bottom) {
                    e.preventDefault();
                    var data = new Date();
                    if (bottom == 0) self.firstTime = 1;
                    else self.firstTime = 2;
                    if (self.insertf.scrollTop == bottom) self.pos = 1;
                    else self.pos = 0;
                    self.drag = {
                        y: e.targetTouches[0].pageY,
                        t: data.getTime()
                    };
                    if (self.headonly && self.insertf.scrollTop == bottom) return false;
                    if (self.footonly && self.insertf.scrollTop == 0) return false;
                    self.dragable = 2;
                }
            } else return false;
        }, false);
        self.insertf.addEventListener("touchmove", function (e) {
            self.drag.y2 = e.targetTouches[0].pageY;
            if (self.drag.y && self.dragable == 2) {
                self.drag.ca = e.targetTouches[0].pageY - self.drag.y;
                if (self.firstTime == 1) {
                    e.preventDefault();
                    if (self.drag.ca < 0)
                        self.pos = 1;
                    else self.pos = 0;
                    self.firstTime == 0;
                } else if (self.firstTime == 2) {
                    if ((self.drag.ca > 0 && self.pos == 0) || (self.drag.ca < 0 && self.pos == 1))
                        e.preventDefault();
                    else {
                        self.insertf.scrollTop -= self.drag.ca * 0.5;
                        return false;
                    }
                }
                if (self.pos) { //向下
                    if (self.headonly) return false;
                    self.lLoading.style.display = "block";
                    self.insertf.style.top = "-96px";
                } else { //向上
                    self.fLoading.style.display = "block";
                    self.insertf.style.top = "96px";
                }
            } else return false;
        }, false);
        self.insertf.addEventListener("touchend", function (e) {
            var data = new Date();
            if (self.firstTime == 2) {
                if ((self.drag.ca > 0 && self.pos == 0) || (self.drag.ca < 0 && self.pos == 1))
                    e.preventDefault();
                else self.fail = 1;
            }
            if (self.drag.y && self.dragable == 2) {
                if (self.fail || (data.getTime() - self.drag.t) < 280) {
                    if (!self.drag.y2) {
                        spec(e.target, self.item, self.insert);
                    }
                    self.fix();
                    return false;
                }
                e.preventDefault();
                self.dragable = 3;
                if (self.pos) {
                    if (self.headonly) return false;
                    self.insertf.style.top = "-70px";
                    loadingActive(self.lLoading);
                    var operation = function () {
                        self.insertf.style.top = "0px";
                        self.insertf.scrollTop = self.insert.clientHeight - self.insertf.clientHeight;
                        transitionend(self.insertf, function () {
                            self.fix();
                        });
                    };
                    setTimeout(function () {
                        self.footrelease({
                            success: function (html) {
                                loadingsuccess(self.lLoading);
                                setTimeout(function () {
                                    self.insert.innerHTML = self.insert.innerHTML + html;
                                    operation();
                                }, 800);
                            },
                            fail: function () {
                                loadingfail(self.lLoading);
                                setTimeout(function () {
                                    operation();
                                }, 800);
                            },
                            none: function () {
                                loadingnone(self.lLoading);
                                setTimeout(function () {
                                    operation();
                                }, 800);
                            }
                        });
                    }, 1000);
                } else {
                    if (self.footonly) return;
                    self.insertf.style.top = "70px";
                    loadingActive(self.fLoading);
                    var operation = function () {
                        self.insertf.scrollTop = 0;
                        self.insertf.style.top = "0px";
                        transitionend(self.insertf, function () {
                            self.fix();
                        });
                    };
                    setTimeout(function () {
                        self.headrelease({
                            success: function (html) {
                                loadingsuccess(self.fLoading);
                                setTimeout(function () {
                                    self.insert.innerHTML = html + self.insert.innerHTML;
                                    operation();
                                }, 800);
                            },
                            fail: function () {
                                loadingfail(self.fLoading);
                                setTimeout(function () {
                                    operation();
                                }, 800);
                            },
                            none: function () {
                                loadingnone(self.fLoading);
                                setTimeout(function () {
                                    operation();
                                }, 800);
                            }
                        });
                    }, 1000);
                }
            } else {
                if (self.dragable != 3) {
                    self.fix();
                    return;
                }
            }
        }, false);
    };

    function loading(o, o2, pos) {
        var div = document.createElement("div"),
            img = document.createElement("img"),
            p = document.createElement("p");
        img.src = style.lodingImg;
        style.loading(div);
        if (pos) {
            div.appendChild(img);
            div.appendChild(p);
            o2.insertBefore(div, o);
            div.style.top = "0px";
        } else {
            div.appendChild(p);
            div.appendChild(img);
            o2.appendChild(div);
            div.style.bottom = "0px";
        }
        loadingRollback(div);
        return div;
    }

    function loadingActive(o) {
        var p = o.querySelectorAll("p")[0],
            img = o.querySelectorAll("img")[0];
        o.style.display = "block";
        img.style.visibility = "visible";
        p.innerHTML = "正在加载，请稍后";
    }

    function loadingsuccess(o) {
        var p = o.querySelectorAll("p")[0],
            img = o.querySelectorAll("img")[0];
        img.src = style.succImg;
        p.innerHTML = "加载成功!";
    }

    function loadingfail(o) {
        var p = o.querySelectorAll("p")[0],
            img = o.querySelectorAll("img")[0];
        img.src = style.failImg;
        p.innerHTML = "加载失败!";
    }

    function loadingnone(o) {
        var p = o.querySelectorAll("p")[0],
            img = o.querySelectorAll("img")[0];
        img.src = style.succImg;
        p.innerHTML = "没有更多了";
    }

    function loadingRollback(o) {
        var p = o.querySelectorAll("p")[0],
            img = o.querySelectorAll("img")[0];
        o.style.display = "none";
        img.src = style.loadingImg;
        img.style.cssText = "visibility:hidden;margin:0 auto";
        p.innerHTML = "释放加载新内容";
    }

    function transitionend(o, fn) {
        var aoff = function () {
            fn(o);
            o.removeEventListener("webkitTransitionEnd", aoff, false);
            o.removeEventListener("transitionend", aoff, false);
        };
        o.addEventListener("webkitTransitionEnd", aoff, false);
        o.addEventListener("transitionend", aoff, false);
    }

    function spec(o, fn, f) {
        if (!toclick(o)) {
            var p = o.parentElement;
            if (!toclick(p) && (p.tagName == fn.toUpperCase() || p.className.indexOf(fn) > -1)) {
                if (p.parentElement !== f) spec(p.parentElement, fn, f);
                else return false;
            } else spec(p, fn, f);
        } else return false;
    }

    function toclick(o) {
        if (o.tagName == "A" || o.onclick) o.click();
        else return false;
    }
    window.HoldReflash = holdreflash;
})();
