export function unique(array: any) {
  var obj = {};
  return array.filter(function (item: any) {
    return obj.hasOwnProperty(item.intent) ? false : (obj[item.intent] = true);
  });
}
