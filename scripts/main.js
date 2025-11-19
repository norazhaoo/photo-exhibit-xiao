// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 预加载图片
    const images = [
        'background/dsc7367.jpg',
        'background/butt.jpg'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // 时间线滚动显示动画 - 初始只显示第一个
    const timelineCards = document.querySelectorAll('.timeline-card');
    const arrows = document.querySelectorAll('.arrow');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const cardIndex = parseInt(entry.target.getAttribute('data-index'));
                
                // 第一个卡片已经可见，跳过
                if (cardIndex === 0) {
                    cardObserver.unobserve(entry.target);
                    return;
                }
                
                // 延迟显示，形成依次出现的效果
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // 显示对应的箭头（前一个箭头）
                    if (cardIndex > 0 && cardIndex <= arrows.length) {
                        setTimeout(() => {
                            arrows[cardIndex - 1].classList.add('visible');
                        }, 600);
                    }
                }, (cardIndex - 1) * 250);
                
                // 观察后取消观察，避免重复触发
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有卡片
    timelineCards.forEach(card => {
        cardObserver.observe(card);
    });

    // 动态计算L型箭头路径
    function drawLArrow(arrow, fromCard, toCard, direction) {
        if (!fromCard || !toCard || !arrow) return;

        const container = document.querySelector('.timeline-container');
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const fromRect = fromCard.getBoundingClientRect();
        const toRect = toCard.getBoundingClientRect();

        // 计算相对于容器的位置
        const fromBottom = fromRect.bottom - containerRect.top;
        const fromCenterX = fromRect.left + fromRect.width / 2 - containerRect.left;
        const toTop = toRect.top - containerRect.top;
        
        // 根据方向确定目标卡片的连接点
        let toCenterX;
        if (direction === 'right') {
            // 连接到右侧卡片的左边中间
            toCenterX = toRect.left - containerRect.left;
        } else {
            // 连接到左侧卡片的右边中间
            toCenterX = toRect.right - containerRect.left;
        }

        // 向下走一半的距离
        const totalVerticalDistance = toTop - fromBottom;
        const verticalDistance = totalVerticalDistance / 2;

        // 设置箭头容器的位置和大小
        const arrowLeft = Math.min(fromCenterX, toCenterX) - 50;
        const arrowTop = fromBottom;
        const arrowWidth = Math.abs(toCenterX - fromCenterX) + 100;
        const arrowHeight = totalVerticalDistance + 50;

        arrow.style.left = arrowLeft + 'px';
        arrow.style.top = arrowTop + 'px';
        arrow.style.width = arrowWidth + 'px';
        arrow.style.height = arrowHeight + 'px';

        // 计算SVG内的相对坐标（相对于箭头容器）
        const startX = fromCenterX - arrowLeft;
        const startY = 0; // 从卡片底部开始
        const endX = toCenterX - arrowLeft;
        const endY = totalVerticalDistance; // 到目标卡片顶部
        const midY = verticalDistance; // 向下走一半的距离

        // 绘制L型路径：向下 -> 水平转向 -> 向上
        const path = arrow.querySelector('.arrow-path');
        const head = arrow.querySelector('.arrow-head');

        // L型路径：从起点向下 -> 水平转向 -> 向上到终点
        path.setAttribute('d', `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`);
        
        // 箭头头部指向目标卡片（向上）
        head.setAttribute('d', `M ${endX} ${endY} L ${endX - 8} ${endY - 15} M ${endX} ${endY} L ${endX + 8} ${endY - 15}`);
    }

    // 动态计算所有箭头位置
    function positionArrows() {
        const cards = Array.from(timelineCards);
        
        // 箭头1: 星盟(0, 左) -> 玫得(1, 右)
        if (cards[0] && cards[1]) {
            const arrow1 = document.querySelector('.arrow-1');
            drawLArrow(arrow1, cards[0], cards[1], 'right');
        }

        // 箭头2: 玫得(1, 右) -> 多样屋(2, 左)
        if (cards[1] && cards[2]) {
            const arrow2 = document.querySelector('.arrow-2');
            drawLArrow(arrow2, cards[1], cards[2], 'left');
        }

        // 箭头3: 多样屋(2, 左) -> 宠物(3, 右)
        if (cards[2] && cards[3]) {
            const arrow3 = document.querySelector('.arrow-3');
            drawLArrow(arrow3, cards[2], cards[3], 'right');
        }

        // 箭头4: 宠物(3, 右) -> 护肤(4, 左)
        if (cards[3] && cards[4]) {
            const arrow4 = document.querySelector('.arrow-4');
            drawLArrow(arrow4, cards[3], cards[4], 'left');
        }
    }

    // 初始定位
    setTimeout(positionArrows, 200);
    
    // 窗口大小改变时重新定位
    window.addEventListener('resize', positionArrows);
    
    // 滚动时重新定位（延迟执行，避免频繁计算）
    let resizeTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(positionArrows, 100);
    });

    // 当卡片显示时重新计算箭头位置
    const arrowObserver = new MutationObserver(() => {
        positionArrows();
    });

    timelineCards.forEach(card => {
        arrowObserver.observe(card, { attributes: true, attributeFilter: ['class'] });
    });
});

