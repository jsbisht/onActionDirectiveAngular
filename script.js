angular.module('toggleViewApp', []).
  /**
   * On action modifies an property on scope.
   * It takes the following parameters:
   *   onAction attribute - (following values seper)
   *     type: type of action,
   *     item: item name on scope,
   *     value: value that is to be set for the item
   *   scopeObj attribute - the variable,
   *   on which the items needs to be modified.
   */
directive('onAction', function(StringUtility, $timeout) {
  return {
    restrict: 'A',
    link: onActionLinkerFn,
    scope: {
      onAction: '=',
      isVisible: '=scopeObj'
    }
  }

  function onActionLinkerFn(scope, element, attribute) {
    var parts = StringUtility.getPartsOfString(scope.onAction);
    parts = convertPartToArray(parts);
    parts = checkValues(parts);

    var events = parts[0];
    for (var index in events) {
      var eventtype = events[index];
      if (eventtype.toLowerCase() == 'KEYUP'.toLowerCase()) {
        element.bind('keyup', function(event) {
          setAttributes(event, scope, parts);
        });
      }

      if (eventtype.toLowerCase() == 'CLICK'.toLowerCase()) {
        element.bind('click', function(event) {
          setAttributes(event, scope, parts);
        });
      }
    }
  }

  function setAttributes(event, scope, parts) {
    event.stopPropagation();

    var attributes = parts[1];
    var values = parts[2];

    for (var index in attributes) {
      var attribute = attributes[index].trim();
      // convert value to boolean from string if string contains 'true' or 'false' value
      var value = StringUtility.stringToBoolean(values[index].trim());
      scope.isVisible[attribute] = value;
    }

    $timeout(function() {
      scope.$apply();
    })
    console.log(scope.isVisible);
  }

  function checkValues(parts) {
    var attributes = parts[1];
    var values = parts[2];

    if (attributes.length != values.length) {
      var value = values[0];
      var values = [];
      for (var index in attributes) {
        values.push(value);
      }
      parts[2] = values;
    }

    return parts;
  }

  function convertPartToArray(parts) {
    for (var index in parts) {
      var part = parts[index];
      if (typeof part == 'string') {
        // convert string to array
        parts[index] = [part.trim()];
      }
    }
    return parts;
  }
}).
controller('toggleViewController', function ($scope) {
  $scope.isVisible = {};
}).
factory('StringUtility', function() {
  return {
    getPartsOfString: getPartsOfString,
    stringToBoolean: stringToBoolean
  }

  /**
   * SPLIT the following string into three parts
   * @param text
   * @returns [part1, part2, part3]
   */
  // TEST INPUTS
  // var text = 'eventType, attributeName, value';
  // var text = '[eventType1, eventType2, ..., eventTypeN], attributeName, value';
  // var text = 'eventType, [attributeName1, attributeName2, ..., attributeNameN], value';
  // var text = 'eventType, attributeName, [value1, value2, ..., valueN]';
  // var text = 'eventType, [attributeName1, attributeName2, ..., attributeNameN], [value1, value2, ..., valueN]';
  // var text = '[eventType1, eventType2, ..., eventTypeN], [attributeName1, attributeName2, ..., attributeNameN], [value1, value2, ..., valueN]';

  function getPartsOfString(text) {
    // if no square bracket found, split by comma
    // else parse each part
    //      find comma separated part or square bracket part
    var parts = [];
    if (text.indexOf('[') > -1) {
      return findPart(parts, text);
    } else {
      return parts = text.split(',');
    }
  }
  /**
   * Recursively find parts of strings
   * @param parts, text
   * @return [part1, part2, part3]
   */
  function findPart(parts, text) {
    text = text.trim();
    var indexOfComma = text.indexOf(',');
    var indexOfOpenBracket = text.indexOf('[');

    if (text.length != 0) {
      // if part doesn't contain bracket
      if (text.indexOf('[') == -1) {
        var indexOfPartEnd = indexOfComma > -1 ? indexOfComma : text.trim().length;
        parts.push(text.substring(0, indexOfPartEnd));
        findPart(parts, text.substring(indexOfPartEnd + 1));
      }
      // if part contains bracket
      else if (indexOfComma > indexOfOpenBracket) {
        var indexOfCloseBracket = text.indexOf(']');
        var partStr = text.substring(indexOfOpenBracket + 1, indexOfCloseBracket);
        var partParts = partStr.split(',');
        parts.push(partParts);
        findPart(parts, text.substring(indexOfCloseBracket + 2));
      } else if (indexOfComma < indexOfOpenBracket) {
        parts.push(text.substring(0, indexOfComma));
        findPart(parts, text.substring(indexOfComma + 1));
      }
    }

    return parts;
  }

  // convert value to boolean from string if string contains 'true' or 'false' value
  function stringToBoolean(string) {
    switch (string.toLowerCase().trim()) {
      case "true":
      case "yes":
      case "1":
        return true;
      case "false":
      case "no":
      case "0":
      case null:
        return false;
    }
    return string;
  }
});
