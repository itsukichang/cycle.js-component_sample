import { Observable as o } from 'rxjs';
import { VNode, div } from '@cycle/dom';
import isolate from '@cycle/isolate';

type Sources = {
  props: {
    content$: o<VNode>;
    visibility$: o<boolean>;
  }
}

type Sinks = {
  DOM: o<VNode>;
}


function render(visible: boolean, content: VNode): VNode {

  return div('.panel', {
    class: {
      'panel--visible': visible
    }
  }, [
      div('.panel__content', [visible ? content : null])
  ]);
}
//snabbdom class
/**
 *classキーのブロックは動的に管理したいクラスを記述します。

 管理するクラス名をキーとし、値が true となるとそれが適用されます。
 */
function Component({ props }: Sources): Sinks {
  const vdom$: o<VNode> = o.combineLatest(
    props.visibility$.startWith(false),
    props.content$,
    (visible, content) => render(visible, content)
  );
  return {
    DOM: vdom$
  };
}


export function ModalComponent({ props }: Sources): Sinks {
  const component = isolate(Component);
    return component({ props });
}
