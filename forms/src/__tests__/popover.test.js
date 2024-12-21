import { JSDOM } from 'jsdom';
import PopoverWidget from '../js/popover.js';

describe('PopoverWidget', () => {
  let dom;
  let document;
  let window;
  let widget;
  let button;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="container">
            <button class="btn" 
              data-popover="popover"
              data-title="Test Title"
              data-content="Test Content">
              Click me
            </button>
          </div>
        </body>
      </html>
    `, { 
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
    });

    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;

    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 120,
      height: 40,
      top: 100,
      left: 100,
      right: 220,
      bottom: 140,
    }));

    widget = new PopoverWidget();
    button = document.querySelector('.btn');
  });

  test('инициализация виджета', () => {
    expect(widget._popovers).toEqual([]);
  });

  test('создание popover при клике', () => {
    const id = widget.showPopover('Test Title', 'Test Content', button);
    
    const popover = document.querySelector('.popover');
    expect(popover).not.toBeNull();
    expect(widget._popovers.length).toBe(1);
    expect(widget._popovers[0].id).toBe(id);
  });

  test('удаление popover', () => {
    const id = widget.showPopover('Test Title', 'Test Content', button);
    widget.removePopover(id);
    
    expect(document.querySelector('.popover')).toBeNull();
    expect(widget._popovers.length).toBe(0);
  });

  test('обновление позиции при ресайзе', () => {
    const id = widget.showPopover('Test Title', 'Test Content', button);
    const popover = document.querySelector('.popover');
    const initialTop = popover.style.top;

    Element.prototype.getBoundingClientRect.mockReturnValue({
      width: 120,
      height: 40,
      top: 200,
      left: 200,
      right: 320,
      bottom: 240,
    });

    window.dispatchEvent(new Event('resize'));
    expect(popover.style.top).not.toBe(initialTop);
  });
});