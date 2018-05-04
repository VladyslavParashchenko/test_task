'use strict';

/**
 * 
 * 
 * @param   {string} tableClassName [[Селектор блока, где хранится строка]]
 */
function SmartTable(tableClassName, _columnCount, _rowCount, _cellSize) {
    var rowCount = validateParametr(_rowCount, SmartTable.TABLE_DEFAULT_ROW);
    var columnCount = validateParametr(_columnCount, SmartTable.TABLE_DEFAULT_COLUMN);
    var cellSize = validateParametr(_cellSize, SmartTable.TABLE_CELL_SIZE);
    var isUserReturnCursor = false;
    var that = this;
    var currentColumn;
    var currentRow;
    this.start = function () {
        setHTML();
        setEventListenter();
    }

    /**
     * [[Вставляет сгенерированную HTML разметку в блок]]
     */
    function setHTML() {
        var html = getHTML();
        document.querySelector(tableClassName).innerHTML = html;
    }

    /**
     * [[Добавляет event listeners]]
     */
    function setEventListenter() {
        var query = tableClassName;
        document.querySelector(query).addEventListener('mouseover', showButtons);
        document.querySelector(query).addEventListener('mouseleave', hideButtons);
        document.querySelector(tableClassName + ' .left-delete-btn').onclick = deleteRow;
        document.querySelector(tableClassName + ' .right-add-btn').onclick = addColumn;
        document.querySelector(tableClassName + ' .bottom-add-btn').onclick = addRow;
        document.querySelector(tableClassName + ' .top-delete-btn').onclick = deleteColumn;
    }
    /**
     * [[Сетер для количества строк]]
     * @param {[[number]]} number [[Новое количество строк]]
     */
    this.setRowCount = function (number) {
        rowCount = number >= 1 ? number : rowCount;
    }
    /**
     * [[Сетер для количества колонок]]
     * @param {[[number]]} number [[Новое количество строк]]
     */
    this.setColumnCount = function (number) {
        columnCount = number >= 1 ? number : columnCount;
    }
    /**
     * 
     * @returns {[[number]]} [[Возвращает количество строк]]
     */
    this.getRowCount = function () {
        return rowCount;
    }
    /**
     * 
     * @returns {[[number]]} [[Возвращает количество столбцов]]
     */
    this.getColumnCount = function () {
        return columnCount;
    }

    /**
     * [[Возвращает готовую HTML разметку для таблицы]]
     * @returns {[[string]]} [[html разметка]]
     */
    function getHTML() {
        var html = getHTMLCodeOuterTable();
        html = html.replace('_inner_table', getHTMLCodeInnerTable());
        return html;
    }

    /**
     * [[Возвращает внешнюю html разметку(кнопки+контейнер для таблицы)]]
     * @returns {[[Type]]} [[Description]]
     */
    function getHTMLCodeOuterTable() {
        var html = `
        <button class="st-btn left-delete-btn">${SmartTable.TABLE_DELETE_CHAR}</button>
        <button class="st-btn top-delete-btn ">${SmartTable.TABLE_DELETE_CHAR}</button><button class="st-btn right-add-btn">${SmartTable.TABLE_ADD_CHAR}</button><button class="st-btn bottom-add-btn">${SmartTable.TABLE_ADD_CHAR}</button>
        _inner_table`;
        return html;
    }

    /**
     * [[Возвращает разметку для основной таблицы]]
     * @returns {[[string]]} [[html]]
     */
    function getHTMLCodeInnerTable() {
        var html = '<table class="inner-table">';
        for (var i = 0; i < that.getRowCount(); i++) {
            html += '<tr>';
            for (var j = 0; j < that.getColumnCount(); j++) {
                html += generateTd(j, i);
            }
            html += '</tr>';
        }
        html += '</table>';
        return html;
    }
    /**
     * [[Возвращает TD элемент]]
     * @param   {[[number]]} column [[номер колонки]]
     * @param   {[[number]]} row    [[номер строки]]
     * @returns {[[string]]} [[td html element]]
     */

    function generateTd(column, row) {
        return `<td class="inner-table-td" data-column='${column}' data-row='${row}'></td>`;
    }
    /**
     * [[Функция, которая показывает горизонтальные кнопки]]
     * @param {[[string]]} buttonType [[селектор,  чтобы выбора нужной кнопки]]
     * @param {[[number]]} column     [[номер колонки на которой должна находится кнопка]]
     * @param {[[number]]} row        [[номер строки на которой должна находится кнопка]]
     */
    function showHorizontButton(buttonType, column, row) {
        var button = document.querySelector(buttonType);
        var left = Math.round((column / that.getColumnCount()) * getTableSizeParametr('width'));
        button.style.left = left + 'px';
        button.classList.add('btn-show');
    }

    /**
     * [[Функция, которая показывает верктикальные кнопки]]
     * @param {[[string]]} buttonType [[селектор,  чтобы выбора нужной кнопки]]
     * @param {[[number]]} column     [[номер колонки на которой должна находится кнопка]]
     * @param {[[number]]} row        [[номер строки на которой должна находится кнопка]]
     */
    function showVerticalButton(buttonType, column, row, parametr) {
        var button = document.querySelector(buttonType);
        var top = Math.round((row / that.getRowCount()) * getTableSizeParametr('height'));
        button.style['top'] = top + 'px';
        button.classList.add('btn-show');
    }

    /**
     * [[Получить номер строки и колонки, где которые необходимо показать]]
     * @param   {object} target [[Елемент на который навели курсором]]
     * @returns {object} [[Объект с параметрами строки и колонки]]
     */
    function getRowAndColumn(target) {
        var c = target.dataset.column * 1;
        var r = target.dataset.row * 1;
        return {
            column: c,
            row: r
        };
    }

    /**
     * [[Функция, которая должна показать нужные кнопки]]
     * @param {[[object]]} e [[объект события]]
     */
    function showButtons(e) {
        switch (e.target.tagName) {
            case "TD":
                var element = e.target;
                var obj = getRowAndColumn(element);
                currentColumn = obj.column;
                currentRow = obj.row;
                if (that.getColumnCount() > 1) {
                    showHorizontButton(tableClassName + ' .top-delete-btn', obj.column, obj.row);
                }
                showHorizontButton(tableClassName + ' .bottom-add-btn', obj.column, obj.row);
                if (that.getRowCount() > 1) {
                    showVerticalButton(tableClassName + ' .left-delete-btn', obj.column, obj.row);
                }
                showVerticalButton(tableClassName + ' .right-add-btn', obj.column, obj.row);
                isUserReturnCursor = false;
                break;
            case "BUTTON":
                buttonOver(e.target);
                break;
        }
    }
    /**
     * [[Функция, которая должна спрятать не нужные кнопки]]
     * @param {[[object]]} e [[объект события]]
     */
    function hideButtons(e) {
        isUserReturnCursor = true;
        setTimeout(() => {
            document.querySelectorAll(tableClassName + ' .st-btn').forEach(function (element) {
                if (isUserReturnCursor) {
                    element.classList.remove('btn-show');
                }
            })
        }, 500);
    }

    /**
     * [[Функция, которая должна показать кнопку, на которую наведен курсор]]
     * @param {[[object]]} e [[объект события]]
     */
    function buttonOver(e) {
        isUserReturnCursor = false;
        var self = e;
        document.querySelectorAll('.st-btn').forEach(function (elem) {
            if (self != elem) {
                elem.classList.remove('btn-show');
            }
        });

    }
    /**
     * [[Функция, которая должна скрыть кнопку, на которую не наведен курсор]]
     * @param {[[object]]} e [[объект события]]
     */
    function buttonMouseOut(e) {
        this.classList.remove('btn-show');
    }

    /**
     * [[Удаляет строку в таблице]]
     * @param {[[object]]} e [[объект события]]
     */
    function deleteRow(e) {
        var query = tableClassName + ` td[data-row='${currentRow}']`;
        document.querySelector(query).parentNode.remove();
        that.setRowCount(that.getRowCount() - 1);
        this.classList.remove('btn-show');
        document.querySelector(tableClassName + ' .bottom-add-btn').style.top = that.getRowCount() * cellSize + 'px';
        renumarateTd();
    }
    /**
     * [[Удаляет колонку в таблице]]
     * @param {[[object]]} e [[объект события]]
     */
    function deleteColumn(e) {
        this.classList.remove('btn-show');
        var query = tableClassName + ` td[data-column='${currentColumn}']`;
        document.querySelectorAll(query).forEach(function (elem) {
            elem.remove()
        });
        that.setColumnCount(that.getColumnCount() - 1);
        renumarateTd();
    }
    /**
     * [[Добавляет новую строку в таблицу]]
     * @param {[[object]]} e [[объект события]]
     */
    function addRow(e) {
        var tr = "<tr>";
        for (var i = 0; i < that.getColumnCount(); i++) {
            tr += generateTd(i, that.getRowCount());
        }
        tr += "</tr>";
        that.setRowCount(that.getRowCount() + 1);
        document.querySelector(tableClassName + " table tbody").innerHTML += tr;
    }
    /**
     * [[Добавляет новую колонку в таблицу]]
     * @param {[[object]]} e [[объект события]]
     */
    function addColumn(e) {
        document.querySelectorAll(tableClassName + " table tbody tr").forEach(function (item, i) {
            item.innerHTML += generateTd(that.getColumnCount(), i);
        });
        that.setColumnCount(that.getColumnCount() + 1);

    }
    /**
     * [[Проставляет новые номера строк и колонок, после удаления]]
     */
    function renumarateTd() {
        var trElements = document.querySelectorAll(tableClassName + " table tr");
        var tdElements;
        var tdElement;
        for (var i = 0; i < trElements.length; i++) {
            tdElements = trElements[i].childNodes;
            for (var j = 0; j < tdElements.length; j++) {
                tdElement = tdElements[j];
                tdElement.dataset.row = i;
                tdElement.dataset.column = j;
            }
        }
    }
    /**
     * [[Функция для получения значения размеров таблицы]]
     * @param   {[[string]} parametr [[параметр который мы получим]]
     * @returns {[[number]]} [[значения параметра]]
     */
    function getTableSizeParametr(parametr) {
        return document.querySelector(tableClassName + " table").getBoundingClientRect()[parametr];
    }
    /**
     * [[Проверяет входные параметры]]
     * @param   {[[number]]} value        [[Параметр, который передан пользователем]]
     * @param   {[[number]]} defaultValue [[Стандартное значение параметра]]
     * @returns {[[number]]} [[Если входной параметр валидный, то параметр, если нет - стандартное значение]]
     */
    function validateParametr(value, defaultValue) {
        value = value * 1;
        if (!Number.isInteger(value)) {
            return defaultValue;
        }
        if (value > 0) {
            return value;
        }
        return defaultValue;
    }

}
SmartTable.TABLE_DEFAULT_ROW = 4;
SmartTable.TABLE_DEFAULT_COLUMN = 4;
SmartTable.TABLE_ADD_CHAR = '+';
SmartTable.TABLE_DELETE_CHAR = '-';
SmartTable.TABLE_BUTTON_DEFAULT_TOP_VALUE = 55;
SmartTable.TABLE_BUTTON_DEFAULT_LEFT_VALUE = 0;
SmartTable.TABLE_CELL_SIZE = 55;
