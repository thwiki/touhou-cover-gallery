new Vue({
    el: '#app',
    data() {
        return {
            // 当前指引器横向索引
            currentXIndex: 0,
            // 当前指引器纵向索引
            currentYIndex: 0,

            // 是否为点击路径指示器触发的索引变化
            isGo: false,

            // 图片和路径指示器的尺寸和间距配置
            imageOp: {
                width: 600,
                height: 400,
                margin: 20
            },
            pathOp: {
                width: 10,
                height: 10,
                marginTop: 5,
                marginLeft: 5
            },
        }
    },
    computed: {
        images() {
            // 直接返回全局的galleryData
            return window.galleryImages;
        },
        currentMaxXIndex() {
            // 横向索引的最大值取决于图片数组的长度
            return this.images.length - 1;
        },
        currentMaxYIndex() {
            if (this.images.length === 0) {
                return 0;
            }
            // 纵向索引的最大值取决于当前横向索引对应的图片组的长度
            return this.images[this.currentXIndex].length - 1;
        },
        imageLeft() {
            // 计算图片的left值
            return this.imageOp.width + this.imageOp.margin;
        },
        imageTop() {
            // 计算图片的top值
            return this.imageOp.height + this.imageOp.margin;
        },
        pathLeft() {
            // 计算路径指示器的left值
            return this.pathOp.width + this.pathOp.marginLeft;
        },
        pathTop() {
            // 计算路径指示器的top值
            return this.pathOp.height + this.pathOp.marginTop;
        }
    },
    watch: {
        currentXIndex(newX) {
            // 当横向索引变化时，重置纵向索引为当前横向索引对应的图片组的最大值
            if (!this.isGo) {
                this.currentYIndex = Math.min(this.currentYIndex, this.currentMaxYIndex);
            }

            // 计算新的left和top值，并更新inside的样式
            this.onChangePos(newX, this.currentYIndex);
        },
        currentYIndex(newY) {
            // 计算新的left和top值，并更新inside的样式
            this.onChangePos(this.currentXIndex, newY);
        }
    },
    methods: {
        initGallery() {
            // 重置横纵向索引
            this.currentXIndex = 0;
            this.currentYIndex = 0;

            // 计算图片数组有几组
            var xlen = this.images.length;

            // 计算每组图片的位置
            for (var i = 0; i < xlen; i++) {
                var refItem = this.$refs['item' + i];
                if (!refItem) {
                    continue;
                }
                var t = refItem[0];
                t.style.left = i * this.imageLeft + 'px';
                var ylen = this.images[i].length;
                for (var j = 0; j < ylen; j++) {
                    var img = this.$refs['img' + i + '_' + j][0];
                    img.style.top = j * this.imageTop + 'px';
                }
            }

            // 监听键盘事件
            window.addEventListener('keydown', (event) => {
                switch (event.key) {
                    case 'ArrowUp':
                        this.handleUp();
                        break;
                    case 'ArrowDown':
                        this.handleDown();
                        break;
                    case 'ArrowLeft':
                        this.handleLeft();
                        break;
                    case 'ArrowRight':
                        this.handleRight();
                        break;
                }
            });

            // 监听触屏事件
            var startX, startY;
            window.addEventListener('touchstart', (event) => {
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
            }, { passive: true });
            window.addEventListener('touchend', (event) => {
                var endX = event.changedTouches[0].clientX;
                var endY = event.changedTouches[0].clientY;
                var deltaX = endX - startX;
                var deltaY = endY - startY;
                if(window.scrollY === 0 && deltaY > 0) {
                    // 当页面滚动到顶部并且是向下滑动时，阻止默认的滚动行为
                    event.preventDefault();
                }
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 30) {
                        this.handleLeft();
                    } else if (deltaX < -30) {
                        this.handleRight();
                    }
                } else {
                    if (deltaY > 30) {
                        this.handleUp();
                    } else if (deltaY < -30) {
                        this.handleDown();
                    }
                }
            }, { passive: false });
        },
        handleUp() {
            // 当纵向索引大于0时，纵向索引减一
            if (this.currentYIndex > 0) {
                this.currentYIndex--;
            }
        },
        handleDown() {
            // 当纵向索引小于最大值时，纵向索引加一
            if (this.currentYIndex < this.currentMaxYIndex) {
                this.currentYIndex++;
            }
        },
        handleLeft() {
            // 当横向索引大于0时，横向索引减一
            if (this.currentXIndex > 0) {
                this.currentXIndex--;
            }
        },
        handleRight() {
            // 当横向索引小于最大值时，横向索引加一
            if (this.currentXIndex < this.currentMaxXIndex) {
                this.currentXIndex++;
            }
        },
        handleGo(x, y) {
            // 横向索引和纵向索引都设置为x和y
            this.isGo = true;
            this.currentXIndex = x;
            this.currentYIndex = y;
        },
        onChangePos(x, y) {
            // 计算新的left和top值，并更新inside的样式
            var left = x * this.imageLeft;
            var top = y * this.imageTop;
            var inside = this.$refs.inside;
            inside.style.left = -left + 'px';
            inside.style.top = -top + 'px';
            this.isGo = false;
        }
    },
    mounted() {
        // 初始化画廊
        this.initGallery();
    }
});