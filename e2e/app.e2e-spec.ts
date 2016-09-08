import { Ng2RulerPage } from './app.po';

describe('ng2-ruler App', function() {
  let page: Ng2RulerPage;

  beforeEach(() => {
    page = new Ng2RulerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
