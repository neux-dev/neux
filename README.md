# veux

A frontend microlibrary with reactivity states and views.

## State

The state is a proxy for objects. States are used to track changes and distribute them to related views and other state fields.

```js
const state = createState({
  counter: 0,
  multiplier: 2,
  tasks: [
    { text: 'Item 1' },
    { text: 'Item 2', checked: true }
  ],
  // the calculated field for an object
  double: (obj, prop) => obj.counter * obj.multiplier,
  // the calculated field for an array
  completed: (obj, prop) => {
    return obj.tasks.filter(item => item.checked);
  }  
});
// set or change the calculated field
state.double = (obj, prop) => state.double * state.multiplier
// delete specified field with all listeners
delete state.double
```

Watching for state changes

```js
const handler = (newv, prop, obj) => {
  const oldv = obj[prop];
  console.log(newv, oldv, prop, obj);
};
// add specified listener
state.$on('double', handler);
// remove specified listener
state.$off('double', handler);
// remove all listeners for the specified field
state.$off('double');
// add a listener to watch any changes
state.tasks.$on('*', handler);
```

Synchronizing state with storage

```js
const localStore = (state, changes) => {
  if (!changes) {
    return JSON.parse(localStorage.getItem('todos') || '[]');
  } else {
    localStorage.setItem('todos', JSON.stringify(state));
  }
};
const remoteStore = async (state, changes) => {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  });
  return await res.json();
};
// bind store with state and sync
state.list.$sync(localStore);
// sync state with store
state.list.$sync();
// unbind store and state
delete state.list;
```

## View

A view is a declarative description of DOM elements.

```js
const state = createState({
  input: '',
  list: [
    { text: 'Item 1'},
    { text: 'Item 2', checked: true },
    { text: 'Item 3' }
  ]
});
createView({
  children: [{
    tagName: 'h1',
    textContent: 'To Do'
  }, {
    tagName: 'input',
    placeholder: 'Enter your task...',
    value: () => state.input,
    on: {
      keyup: (e) => {
        if (e.keyCode === 13) {
          e.preventDefault();
          state.list.push({ text: e.target.value });
          state.input = '';
        }
      },
    }
  }, {
    tagName: 'div',
    children: [{
      tagName: 'input',
      type: 'checkbox',
      on: {
        change: (e) => {
          const checked = e.target.checked;
          state.list.forEach((item) => {
            item.checked = checked;
          });
        }
      }
    }, {
      tagName: 'label',
      textContent: 'Mark all as complete'
    }]
  }, {
    tagName: 'ul',
    children: () => {
      return state.list.$each(item => {
        return {
          tagName: 'li',
          on: {
            mounted: () => console.log('mounted', item),
            removed: () => console.log('removed', item)
          },
          children: [{
            tagName: 'input',
            type: 'checkbox',
            checked: () => item.checked,
            on: {
              change: (e) => {
                item.checked = e.target.checked;
              }
            }
          }, {
            tagName: 'label',
            textContent: () => item.text
          }, {
            tagName: 'a',
            href: '#',
            textContent: '[x]',
            on: {
              click: (e) => {
                e.preventDefault();
                const index = state.list.indexOf(item);
                state.list.splice(index, 1);
              }
            }
          }]
        };
      });
    }
  }, {
    textContent: () => `Total items: ${state.list.length}`
  }]
}, document.body);
```

## Localization

```js
const locales = {
  en: {
    say: {
      hello: "Hello %{name}!"
    }
  },
  ru: {
    say: {
      hello: "Привет %{name}!"
    }
  }
};
const fallbackLang = 'en';
const l10n = createL10n(locales, fallbackLang);
const msg = l10n.t('say.hello', { name: 'World' }, 'en');
console.log(msg); // Hello World!
l10n.lang = 'en'
const msgEn = l10n.t('say.hello', { name: 'World' });
console.log(msgEn) // Hello World!
l10n.lang = 'ru'
const msgRu = l10n.t('say.hello', { name: 'Мир' });
console.log(msgRu) // Привет Мир!
```

## Routing

```js
const router = createRouter();
createView({
  children: [{
    children: [{
      tagName: 'a',
      href: '#page1',
      textContent: 'Page 1'
    }, {
      tagName: 'a',
      href: '#page2?param1=1',
      textContent: 'Page 2'
    }, {
      tagName: 'button',
      textContent: 'Page 3',
      on: {
        click: () => {
          router.show('#page3', { param1: '1', param2: '2' });
        }
      }
    }]
  }, {
    children: () => {
      switch (router.path) {
      case '#page1':
        return [{
          tagName: 'p',
          textContent: 'Page 1'
        }];
      case '#page2':
        return [{
          tagName: 'p',
          textContent: 'Page 2'
        }];
      case '#page3':
        return [{
          tagName: 'p',
          textContent: 'Page 3'
        }];
      default:
        return [{
          tagName: 'p',
          textContent: 'Not found'
        }];
      }
    }
  }, {
    textContent: () => `Path: ${router.path} , Params: ${JSON.stringify(router.params)}`
  }]
}, document.body);
```

## To do

- [x] State
- [x] View
- [x] L10n
- [x] Router
- [x] State sync with stores
- [ ] Real-time state sync
- [ ] P2P state sync
