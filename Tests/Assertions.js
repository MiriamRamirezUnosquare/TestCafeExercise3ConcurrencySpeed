import { Selector } from 'testcafe';

const getElementsByXPath = Selector(xpath => {
    const iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const items = [];
    let item = iterator.iterateNext();
    while (item) {
        items.push(item);
        item = iterator.iterateNext();
    }
    return items;
});

export default function (xpath) {
    return Selector(getElementsByXPath(xpath));
}

fixture `Microsoft page`
    .page `https://www.microsoft.com/en-us`;

test('validate Microfost\'s search bar', async t => {

    await t
    .maximizeWindow()
    .expect(Selector('button#search').exists).ok({timeout:3000}, 'Assert element exists')
    .expect(Selector('button#search').textContent).contains('Search', {timeout:3000}, 'Assert element contains "Search"')
    .click('button#search')
    .typeText(Selector(getElementsByXPath('//input[@type="search"]')), 'Surface pro')
    .click('button#search')
    .wait(2000)

    if(await Selector('button').withText('Stay in United States - English').exists)
        await t.click(Selector('button').withText('Stay in United States - English'))        
    
    .expect(Selector('h4>a').count).gt(0, {timeout:3000}, 'Assert search returned elements')
    .expect(Selector('nav a').withExactText('Shop').exists).ok({timeout:3000}, 'Assert "Shop" category shows correctly')
    .expect(Selector('nav a').withExactText('Explore').exists).ok({timeout:3000}, 'Assert "Explore" category shows correctly')
    .click(Selector('nav a').withExactText('Shop'))
    .expect(Selector('ul[id="accordionProductFilters"] a').count).gt(0, {timeout:3000}, 'Assert left menu in "Shop" displays options' )
    .expect(Selector('section[aria-label*="Hardware and Accessories"] h4').innerText).contains('245', {timeout: 3000}, 'Assert that "Hardware and Accessories" section displayed count is 245')
    
    .selectText(Selector(getElementsByXPath('//input[@type="search"]')))
    .pressKey('Delete')
    .typeText(Selector(getElementsByXPath('//input[@type="search"]')), 'Windows')
    .click('button#search')
    .click(Selector('nav a').withExactText('Shop'))
    .expect(Selector('section[aria-label*="Software"] h4').innerText).contains('9', {timeout: 3000}, 'Assert that "Software" section displayed count is 9')
});