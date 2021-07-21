(function (window, document) {
    var ImgView = function (targetDom, options) {
        // 判断是用函数创建的还是用new创建的。这样我们就可以通过MaskShare("dom") 或 new MaskShare("dom")来使用这个插件了  
        if (!(this instanceof ImgView)) return new ImgView(targetDom, options);
        // 参数
        this.options = this.extend({
            dataList: [],
            currentSrc: ""
        }, options);
        // 获取dom
        this.targetDom = document.getElementById(targetDom);
        var html = "<div id='imgViewDiv' class='img-view-dialog'>" +
            "<div id='imgViewContent' class='img-view-content' draggable>" +
            "<img id='dialogImg' class='dialog-img' src=''></div>" +
            "<div class='dialog-tool'><i id='closeDialog' class='close-dialog'></i>" +
            "<i id='rotateDialog' class='rotate-dialog'></i><i id='prevDialog' class='previous-dialog'></i>" +
            "<i id='nextDialog' class='next-dialog'></i></div></div>";
        this.targetDom.innerHTML = html;
        this.btnClose = document.getElementById("closeDialog");
        this.btnRotate = document.getElementById("rotateDialog");
        this.btnPrev = document.getElementById("prevDialog");
        this.btnNext = document.getElementById("nextDialog");
        this.imgViewDiv = document.getElementById("imgViewDiv");
        this.imgViewContent = document.getElementById("imgViewContent");
        this.dialogImg = document.getElementById("dialogImg");
        this.num = 0;
        this.winWidth = 0;
        this.winHeight = 0;
        this.startX = 0, this.startY = 0, this.x = 0, this.y = 0;
        this.index = 1;
        this.event();
    }
    ImgView.prototype = {
        init: function () {
            this.event();
        },
        extend: function (obj, obj2) {
            for (var k in obj2) {
                obj[k] = obj2[k];
            }
            return obj;
        },
        event: function () {
            var _this = this;
            _this.thisSrc = _this.options.currentSrc;
            var dataList = _this.options.dataList;
            var index = dataList.indexOf(_this.thisSrc);
            _this.checkImg(_this.options.currentSrc, index);
            // 关闭
            _this.btnClose.addEventListener("click", function () {
                _this.close(_this);
            });
            // 旋转
            _this.btnRotate.addEventListener("click", function () {
                _this.rotate(_this);
            });
            // 上一张
            _this.btnPrev.addEventListener("click", function () {
                _this.prev(_this);
            });
            // 下一张
            _this.btnNext.addEventListener("click", function () {
                _this.next(_this);
            });
            // 鼠标按下
            _this.imgViewContent.addEventListener("mousedown", function (event) {
                _this.mousedown(_this, event);
            });
            // 滚轮事件 chrome & ie
            _this.imgViewContent.addEventListener("mousewheel", function (event) {
                if (event.target.tagName === "IMG") {
                    _this.mousewheel(_this, event);
                }
            });
            // 滚轮事件 firefox
            _this.imgViewContent.addEventListener("DOMMouseScroll", function (event) {
                if (event.target.tagName === "IMG") {
                    _this.mousewheel(_this, event);
                }
            });
            // 键盘事件
            document.onkeydown = function(event) {
                _this.keyClose(_this,event);
            };
        },
        // 滚轮事件
        mousewheel: function (_this, event) {
            event.preventDefault();
            var delta = (event.wheelDelta && (event.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
                (event.detail != 0 && (event.detail > 0 ? -1 : 1));
            if (delta > 0) {
                // 向上滚
                _this.index = _this.index + 0.1;
                if (_this.index > 4) {
                    _this.index = 4;
                }

            } else if (delta < 0) {
                // 向下滚
                _this.index = _this.index - 0.1;
                if (_this.index < 0.1) {
                    _this.index = 0.1;
                }
            }
            _this.imgViewContent.style.marginLeft = _this.imgMarginLeft - ((_this.index - 1) * _this.imgWidth) / 2 + "px";
            _this.imgViewContent.style.marginTop = _this.imgMarginTop - ((_this.index - 1) * _this.imgHeight) / 2 + "px";
            event.target.style.width = _this.imgWidth * _this.index + "px";
            event.target.style.height = _this.imgHeight * _this.index + "px";
        },
        // 鼠标按下事件(拖拽用)
        mousedown: function (_this, event) {
            event.preventDefault();
            var imgWidth = _this.imgWidth * _this.index;
            var imgHeight = _this.imgHeight * _this.index;
            var rotateNum = _this.num * 90;
            // 根据旋转的角度不同，坐标也不一样
            if (rotateNum % 90 == 0 && rotateNum % 180 != 0 && rotateNum % 270 != 0 && rotateNum % 360 != 0) {
                _this.startX = (imgWidth - imgHeight) / 2 + imgHeight - event.offsetY;
                _this.startY = event.offsetX - (imgWidth - imgHeight) / 2;
            } else if (rotateNum % 180 == 0 && rotateNum % 360 != 0) {
                _this.startX = imgWidth - event.offsetX;
                _this.startY = imgHeight - event.offsetY;
            } else if (rotateNum % 270 == 0 && rotateNum % 360 != 0) {
                _this.startX = (imgWidth - imgHeight) / 2 + event.offsetY;
                _this.startY = imgWidth - event.offsetX - (imgWidth - imgHeight) / 2;
            } else {
                _this.startX = event.offsetX;
                _this.startY = event.offsetY;
            }
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
            // 拖拽
            function mousemove(event) {
                _this.y = event.clientY - _this.startY - 10;
                _this.x = event.clientX - _this.startX - 10;
                _this.imgViewContent.style.marginTop = "" + _this.y + "px";
                _this.imgViewContent.style.marginLeft = "" + _this.x + "px";
                _this.imgViewContent.style.transition = "margin 0s";
            };
            // 鼠标放开
            function mouseup() {
                document.removeEventListener('mousemove', mousemove);
                document.removeEventListener('mouseup', mouseup);
                _this.imgViewContent.style.transition = "all 0.6s";
            }
        },
        // 关闭
        close: function (_this) {
            var imgViewDiv = document.getElementById("imgViewDiv");
            imgViewDiv.setAttribute("class", "img-view-dialog closing");
            setTimeout(function () {
                imgViewDiv.setAttribute("class", "img-view-dialog");
                imgViewDiv.style.display = "none";
                _this.num = 0;
            }, 400);
        },
        keyClose: function (_this,event) {
            var e = event || window.event;
            //console.log(e.keyCode);
            if (e.keyCode === 27) {
                //window.removeEventListener("keydown");
                _this.close(_this);
                document.onkeydown = null;
            } else if (e.keyCode === 39) {
                _this.next(_this);
            } else if (e.keyCode === 37) {
                _this.prev(_this);
            }
        },
        // 旋转
        rotate: function (_this) {
            _this.num++;
            _this.imgViewContent.style.transform = "rotate(" + _this.num * 90 + "deg) scale(1, 1)";
        },
        // 上一张
        prev: function (_this) {
            var dialogImg = document.getElementById("dialogImg");
            var thisSrc = dialogImg.attributes[2].value;
            if (thisSrc.indexOf("width:") != -1 || thisSrc.indexOf("height:") != -1) {
                thisSrc = dialogImg.attributes[3].value;
            }
            var dataList = _this.options.dataList;
            var index = dataList.indexOf(thisSrc);
            if (index > 0 && index <= (dataList.length - 1)) {
                index = index - 1;
                _this.checkImg(dataList[index], index);
            }

        },
        // 下一张
        next: function (_this) {
            var dialogImg = document.getElementById("dialogImg");
            var thisSrc = dialogImg.attributes[2].value;
            if (thisSrc.indexOf("width:") != -1 || thisSrc.indexOf("height:") != -1) {
                thisSrc = dialogImg.attributes[3].value;
            }
            var dataList = _this.options.dataList;
            var index = dataList.indexOf(thisSrc);
            if (index >= 0 && index < (dataList.length - 1)) {
                index = index + 1;
                _this.checkImg(dataList[index], index);
            }
        },
        // 点击图片
        checkImg: function (thisSrc, index) {
            var _this = this;
            var dataList = _this.options.dataList;
            _this.index = 1;
            _this.num = 0;
            _this.dialogImg.style.transform = "";
            _this.imgViewContent.setAttribute("class", "img-view-content");
            _this.getWindowWH();
            if (index == 0) {
                _this.btnPrev.style.display = "none";
            } else if (index == (dataList.length - 1)) {
                _this.btnNext.style.display = "none";
            } else {
                _this.btnPrev.style.display = "block";
                _this.btnNext.style.display = "block";
            }
            var image = new Image();
            image.src = thisSrc;
            var width = image.width;
            var height = image.height;
            var ww = 860;
            var wh = _this.winHeight - 20;
            if (width < ww && height < wh) {
                width = width;
                height = height;
            } else {
                var scale_x = width / ww;
                var scale_y = height / wh;
                if (scale_x > scale_y) {
                    var width = ww;
                    var height = parseInt(height / scale_x);
                } else {
                    var width = parseInt(width / scale_y);
                    var height = wh;
                }
            }
            _this.imgWidth = width;
            _this.imgHeight = height;
            var left = (_this.winWidth - width) / 2;
            var top = (_this.winHeight - height) / 2;
            _this.imgMarginLeft = left;
            _this.imgMarginTop = top;
            _this.imgViewContent.style.cssText = "margin-top:" + top + "px; margin-left:" + left + "px";
            _this.dialogImg.style.cssText = "width:" + width + "px; height:" + height + "px;";
            setTimeout(function () {
                _this.dialogImg.setAttribute("src", thisSrc);
                _this.imgViewContent.setAttribute("class", "img-view-content loadingImg");
            }, 600);
        },
        // 获取浏览器宽高
        getWindowWH: function () {
            var _this = this;
            if (window.innerWidth)
                _this.winWidth = window.innerWidth;
            else if ((document.body) && (document.body.clientWidth))
                _this.winWidth = document.body.clientWidth;
            // 获取窗口高度
            if (window.innerHeight)
                _this.winHeight = window.innerHeight;
            else if ((document.body) && (document.body.clientHeight))
                _this.winHeight = document.body.clientHeight;
            // 通过深入 Document 内部对 body 进行检测，获取窗口大小
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                _this.winHeight = document.documentElement.clientHeight;
                _this.winWidth = document.documentElement.clientWidth;
            }
        }
    }
    window.ImgView = ImgView;
}(window, document));
