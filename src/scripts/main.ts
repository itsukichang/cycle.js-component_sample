import 'core-js/shim';
import { run } from '@cycle/rxjs-run';
import { VNode, makeDOMDriver, p, button,span, div, h2} from '@cycle/dom';
import { Observable as o } from 'rxjs';
import { DOMSource } from '@cycle/dom/rxjs-typings';
import { ModalComponent } from './components/ModalComponent';

type So = {
  DOM: DOMSource
};

type Si = {
  DOM: o<VNode>
};

function main(sources: So): Si {
  const modal = ModalComponent({
    props: {
      content$: o.of(
        div([
          p('hogehoge'),
          button('#dialog-close', [
            span('x')
          ])
        ])
      ),
      visibility$: o.merge(
        sources.DOM.select('#dialog-open').events('click').mapTo(true),
        sources.DOM.select('#dialog-close').events('click').mapTo(false)
      ).startWith(false)
    }
  });

  return {
    DOM: o.from(modal.DOM).map((modalDOM) => {
      return div('.container', [
        h2('.page-header', 'Modal'),
        div([
          button('#dialog-open.bt.btn-default', 'Open'),
          modalDOM,
        ])
      ])
    })
  };
}

run(main, {
  DOM: makeDOMDriver('#app')
});
