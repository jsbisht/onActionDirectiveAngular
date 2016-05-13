# onActionDirectiveAngular
onAction directives to set visibility of multiple panels

> scope-obj="isVisible"
where,
isVisible is the object that will hold the attibute used for setting panels visibility.

> on-action="'EVENT(s), ATTIBUTE(s), VALUE(s)'"
where,
first is the list of events
second is the list of attributes to be modified
third is the list of attribute values

*eg. Setting only one attribute*
on-action="'KEYUP, attribute, value'"

*eg. Setting multiple attribute at the same time*
on-action="'CLICK, [days, select], [false, false]'"

*eg. Setting multiple events and attribute at the same*
on-action="'[CLICK, KEYUP], [days, select], [false, false]'"
In this case, when any of the event is triggered, the attribute values are modified.
