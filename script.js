/*
 * 备注：本脚本将滚动位置映射为六个场景的可见性和视差位移。六个场景在页面加载时动态创建，
 * 每个场景只包含极少数淡色图形，以保持实景背景的主导地位。滚动事件通过 requestAnimationFrame
 * 节流，让场景平滑过渡，内部的浮动元素以不同速率移动，为实景照片增添微妙的深度感。
 * 所有视觉效果都由原生 JS 驱动，不依赖外部库。
 */

const SCENE_COUNT = 6;
const scenes = [
  { id: 'scene-deepsea',   title: 'DEEP SEA',      subtitle: 'Pressure & silence',     count: 5,  types: ['circle','triangle'],      base: [20,40,80] },
  { id: 'scene-shallow',   title: 'SHALLOW WATERS', subtitle: 'Light returns',         count: 5,  types: ['circle','triangle'],      base: [40,160,200] },
  { id: 'scene-beach',     title: 'THE SHORE',      subtitle: 'Grains of transition',  count: 6,  types: ['circle','triangle','star'], base: [250,210,140] },
  { id: 'scene-grassland', title: 'GRASSLANDS',     subtitle: 'Wind & motion',         count: 5,  types: ['circle','triangle','star'], base: [100,160,60] },
  { id: 'scene-mountain',  title: 'MOUNTAINS',      subtitle: 'Endurance above',       count: 4,  types: ['triangle','star'],        base: [140,150,160] },
  { id: 'scene-starry',    title: 'COSMOS',         subtitle: 'Infinite scroll',       count: 10, types: ['star','circle'],           base: [220,220,240] }
];

const stage = document.getElementById('stage');
const progressFill = document.getElementById('progressFill');

function createShape(type, r, g, b) {
  const el = document.createElement('div');
  const size = 20 + Math.random() * 40;
  el.style.position = 'absolute';
  el.style.left = Math.random() * 100 + '%';
  el.style.top = Math.random() * 100 + '%';
  el.style.opacity = 0.1 + Math.random() * 0.15;

  if (type === 'triangle') {
    el.className = 'triangle';
    el.style.borderLeft = (size/2)+'px solid transparent';
    el.style.borderRight = (size/2)+'px solid transparent';
    el.style.borderBottom = size+'px solid rgba('+r+','+g+','+b+',0.15)';
  } else if (type === 'star') {
    el.className = 'star';
    el.style.width = size+'px';
    el.style.height = size+'px';
    el.style.background = 'rgba('+r+','+g+','+b+',0.12)';
  } else {
    el.className = 'shape';
    el.style.width = size+'px';
    el.style.height = size+'px';
    el.style.background = 'rgba('+r+','+g+','+b+',0.08)';
  }
  return el;
}

function buildScenes() {
  scenes.forEach(scene => {
    const div = document.createElement('div');
    div.className = 'scene';
    div.id = scene.id;
    const content = document.createElement('div');
    content.className = 'scene-content';
    content.innerHTML = `<h2>${scene.title}</h2><p>${scene.subtitle}</p >`;
    div.appendChild(content);
    for (let i = 0; i < scene.count; i++) {
      const type = scene.types[Math.floor(Math.random() * scene.types.length)];
      const shapeEl = createShape(type, ...scene.base);
      shapeEl.classList.add('float-shape');
      div.appendChild(shapeEl);
    }
    stage.appendChild(div);
  });
}
buildScenes();

const sceneDivs = document.querySelectorAll('.scene');
let totalScrollHeight = document.body.scrollHeight - window.innerHeight;

function getVisibility(index, progress) {
  const start = index / SCENE_COUNT;
  const end = (index + 1) / SCENE_COUNT;
  const fade = 0.35 / SCENE_COUNT;
  if (progress < start - fade) return 0;
  if (progress < start + fade) return (progress - (start - fade)) / (2 * fade);
  if (progress <= end - fade) return 1;
  if (progress < end + fade) return 1 - (progress - (end - fade)) / (2 * fade);
  return 0;
}

function update() {
  const progress = Math.min(window.scrollY / totalScrollHeight, 1);
  progressFill.style.width = (progress * 100) + '%';
  sceneDivs.forEach((scene, idx) => {
    const vis = getVisibility(idx, progress);
    scene.style.opacity = vis;
    scene.style.transform = `translateY(${(1 - vis) * 12}px)`;
    const shapes = scene.querySelectorAll('.float-shape');
    shapes.forEach((shape, i) => {
      const speed = 0.3 + (i % 3) * 0.2;
      const y = progress * 60 * speed * (i % 2 === 0 ? 1 : -1);
      const x = Math.sin(progress * Math.PI * 2 + i) * 20;
      shape.style.transform = `translate(${x}px, ${y}px)`;
      shape.style.opacity = 0.08 + vis * 0.25;
    });
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { update(); ticking = false; });
    ticking = true;
  }
});
window.addEventListener('resize', () => {
  totalScrollHeight = document.body.scrollHeight - window.innerHeight;
  update();
});
window.addEventListener('load', update);