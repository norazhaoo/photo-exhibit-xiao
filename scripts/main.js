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
});

