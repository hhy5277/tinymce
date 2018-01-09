/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import Tools from 'tinymce/core/util/Tools';
import NodeType from '../core/NodeType';
import Selection from '../core/Selection';

var findIndex = function (list, predicate) {
  for (var index = 0; index < list.length; index++) {
    var element = list[index];

    if (predicate(element)) {
      return index;
    }
  }
  return -1;
};
var listState = function (editor, listName) {
  return function (e) {
    var ctrl = e.control;

    editor.on('NodeChange', function (e) {
      var tableCellIndex = findIndex(e.parents, NodeType.isTableCellNode);
      var parents = tableCellIndex !== -1 ? e.parents.slice(0, tableCellIndex) : e.parents;
      var lists = Tools.grep(parents, NodeType.isListNode);
      ctrl.active(lists.length > 0 && lists[0].nodeName === listName);
    });
  };
};

var indentPostRender = function (editor) {
  return function (e) {
    var ctrl = e.control;

    editor.on('nodechange', function () {
      var listItemBlocks = Selection.getSelectedListItems(editor);
      var disable = listItemBlocks.length > 0 && NodeType.isFirstChild(listItemBlocks[0]);
      ctrl.disabled(disable);
    });
  };
};

var register = function (editor) {
  var hasPlugin = function (editor, plugin) {
    var plugins = editor.settings.plugins ? editor.settings.plugins : '';
    return Tools.inArray(plugins.split(/[ ,]/), plugin) !== -1;
  };

  if (!hasPlugin(editor, 'advlist')) {
    editor.addButton('numlist', {
      active: false,
      title: 'Numbered list',
      cmd: 'InsertOrderedList',
      onPostRender: listState(editor, 'OL')
    });

    editor.addButton('bullist', {
      active: false,
      title: 'Bullet list',
      cmd: 'InsertUnorderedList',
      onPostRender: listState(editor, 'UL')
    });
  }

  editor.addButton('indent', {
    icon: 'indent',
    title: 'Increase indent',
    cmd: 'Indent',
    onPostRender: indentPostRender(editor)
  });
};

export default {
  register: register
};