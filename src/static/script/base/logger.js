function rewrite_console(output) {
  if (typeof console === 'undefined') {
    window.console = {};
    var noop = function() { };
    var fns = 'log memory debug error info warn dir dirxml table trace assert count markTimeline profile profileEnd time timeEnd timeStamp timeline timelineEnd group groupCollapsed groupEnd clear'.split(' ');
    while (fns.length) console[fns.pop()] = noop;
  }
  var log = console.log;
  console.log = function() {
    var html = Array.prototype.slice.call(arguments).join(' ').replace(/\n+/g, '<br>') + '<br><hr>';
    if (output) {
      output.innerHTML = output.innerHTML + html;
    } else {
      document.write(html);
    }
    log.apply(this, arguments);
  };
}
