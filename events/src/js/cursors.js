const hammerSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
  <path fill="#EE8700" d="M299.3 164.6l6.6 323c0.2 9.2-7.2 16.7-16.4 16.7h-62.1c-9.2 0-16.6-7.5-16.4-16.7l6.6-323 2.6-129.2 0.2-11.7c0.2-8.9 7.5-16 16.4-16h43.2c8.9 0 16.2 7.1 16.4 16l0.2 11.7 2.7 129.2z"/>
  <path fill="#3E3B43" d="M392 160c0 2.5-2 4.5-4.5 4.5H299h-84h-70.3c-1.2 0-2.4-0.5-3.3-1.4l-47-50c-7-7.4-7-19 0-26.5l47-50c0.9-0.9 2-1.4 3.3-1.4h75.4h76.4h90.8c2.5 0 4.5 2 4.5 4.5V160z"/>
</svg>
`;

const cursors = {
  auto: 'auto',
  hammer: `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(hammerSVG)}") 16 16, pointer`
};

export default cursors;