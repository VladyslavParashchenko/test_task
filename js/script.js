'use strict';


class Table {
    static get TABLE_DEFAULT_ROW() {
        return 4;
    }
    static get TABLE_DEFAULT_COLUMN() {
        return 4;
    }
    static get TABLE_ADD_CHAR() {
        return '+';
    }
    static get TABLE_DELETE_CHAR(){
        return '-';
    }
    /**
     * [[Проверяет входные параметры]]
     * @param   {[[number]]} value        [[Параметр, который передан пользователем]]
     * @param   {[[number]]} defaultValue [[Стандартное значение параметра]]
     * @returns {[[number]]} [[Если входной параметр валидный, то параметр, если нет - стандартное значение]]
     */
    validateParam(value, defaultValue) {
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
/**
 * 
 * 
 * @param   {string} tableClassName [[Селектор блока, где хранится строка]]
 */

class SmartTable extends Table{
    constructor(tableClassName, columnCount, rowCount, cellSize){
        super();
        this.tableClassName = tableClassName;
        this.RowCount = super.validateParam(rowCount, SmartTable.TABLE_DEFAULT_ROW);
        this.ColumnCount = super.validateParam(columnCount, SmartTable.TABLE_DEFAULT_COLUMN);
        this.isUserReturnCursor = false;
        this.currentColumn;
        this.currentRow;
    }
    start() {
        this.setHTML();
        this.setEventListenter();
    }

    /**
     * [[Вставляет сгенерированную HTML разметку в блок]]
     */
    setHTML() {
        document.querySelector(this.tableClassName).innerHTML = this.getHTML();
    }

    /**
     * [[Добавляет event listeners]]
     */
    setEventListenter() {
        let query = this.tableClassName;
        document.querySelector(query).addEventListener('mouseover', this.showButtons.bind(this));
        document.querySelector(query).addEventListener('mouseleave', this.hideButtons.bind(this));
        document.querySelector(this.tableClassName + ' .left-delete-btn').addEventListener('click', this.deleteRow.bind(this));
        document.querySelector(this.tableClassName + ' .right-add-btn').addEventListener('click',this.addColumn.bind(this));
        document.querySelector(this.tableClassName + ' .bottom-add-btn').addEventListener('click',this.addRow.bind(this));
        document.querySelector(this.tableClassName + ' .top-delete-btn').addEventListener('click',this.deleteColumn.bind(this));
    }
    /**
     * [[Сетер для количества строк]]
     * @param {[[number]]} value [[Новое количество строк]]
     */
    set rowCount(value) {
        this.RowCount = value >= 1 ? value : this.RowCount;
    }
    /**
     * [[Сетер для количества колонок]]
     * @param {[[number]]} value [[Новое количество строк]]
     */
    set columnCount(value) {
        this.ColumnCount = value >= 1 ? value : this.ColumnCount;
    }
    /**
     * 
     * @returns {[[number]]} [[Возвращает количество строк]]
     */
    get rowCount() {
        return this.RowCount;
    }
    /**
     * 
     * @returns {[[number]]} [[Возвращает количество столбцов]]
     */
    get columnCount() {
        return this.ColumnCount;
    }

    /**
     * [[Возвращает готовую HTML разметку для таблицы]]
     * @returns {[[string]]} [[html разметка]]
     */
    getHTML() {
        let html = this.getHTMLCodeOuterTable();
        html = html.replace('_inner_table', this.getHTMLCodeInnerTable());
        return html;
    }

    /**
     * [[Возвращает внешнюю html разметку(кнопки+контейнер для таблицы)]]
     * @returns {string} [[html code]]
     */
    getHTMLCodeOuterTable() {
        let html = `
        <button class="st-btn left-delete-btn">${SmartTable.TABLE_DELETE_CHAR}</button>
        <button class="st-btn top-delete-btn ">${SmartTable.TABLE_DELETE_CHAR}</button><button class="st-btn right-add-btn">${SmartTable.TABLE_ADD_CHAR}</button><button class="st-btn bottom-add-btn">${SmartTable.TABLE_ADD_CHAR}</button>
        _inner_table`;
        return html;
    }

    /**
     * [[Возвращает разметку для основной таблицы]]
     * @returns {[[string]]} [[html]]
     */
    getHTMLCodeInnerTable() {
        let html = '<table class="inner-table">';
        for (let i = 0; i < this.rowCount; i++) {
            html += '<tr>';
            for (let j = 0; j < this.columnCount; j++) {
                html += this.generateTd(j, i);
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

    generateTd(column, row) {
        return `<td class="inner-table-td" data-column='${column}' data-row='${row}'></td>`;
    }
    /**
     * [[Функция, которая показывает горизонтальные кнопки]]
     * @param {[[string]]} buttonType [[селектор,  чтобы выбора нужной кнопки]]
     * @param {[[number]]} column     [[номер колонки на которой должна находится кнопка]]
     * @param {[[number]]} row        [[номер строки на которой должна находится кнопка]]
     */
    showHorizontButton(buttonType, column, row) {
        let button = document.querySelector(buttonType);
        let left = Math.round((column / this.ColumnCount) * this.getTableSizeParam('width'));
        button.style.left = left + 'px';
        button.classList.add('btn-show');
    }

    /**
     * [[Функция, которая показывает верктикальные кнопки]]
     * @param {[[string]]} buttonType [[селектор,  чтобы выбора нужной кнопки]]
     * @param {[[number]]} column     [[номер колонки на которой должна находится кнопка]]
     * @param {[[number]]} row        [[номер строки на которой должна находится кнопка]]
     */
    showVerticalButton(buttonType, column, row) {
        let button = document.querySelector(buttonType);
        let top = Math.round((row / this.RowCount) * this.getTableSizeParam('height'));
        button.style['top'] = top + 'px';
        button.classList.add('btn-show');
    }

    /**
     * [[Получить номер строки и колонки, где которые необходимо показать]]
     * @param   {object} target [[Елемент на который навели курсором]]
     * @returns {object} [[Объект с параметрами строки и колонки]]
     */
    getRowAndColumn(target) {
        let c = target.dataset.column * 1;
        let r = target.dataset.row * 1;
        return {
            column: c,
            row: r
        };
    }

    /**
     * [[Функция, которая должна показать нужные кнопки]]
     * @param {[[object]]} e [[объект события]]
     */
    showButtons(e) {
        switch (e.target.tagName) {
            case "TD":
                let element = e.target;
                let obj = this.getRowAndColumn(element);
                this.currentColumn = obj.column;
                this.currentRow = obj.row;
                if (this.ColumnCount > 1) {
                    this.showHorizontButton(this.tableClassName + ' .top-delete-btn', obj.column, obj.row);
                }
                this.showHorizontButton(this.tableClassName + ' .bottom-add-btn', obj.column, obj.row);
                if (this.RowCount > 1) {
                    this.showVerticalButton(this.tableClassName + ' .left-delete-btn', obj.column, obj.row);
                }
                this.showVerticalButton(this.tableClassName + ' .right-add-btn', obj.column, obj.row);
                this.isUserReturnCursor = false;
                break;
            case "BUTTON":
                this.buttonOver(e.target);
                break;
        }
    }
    /**
     * [[Функция, которая должна спрятать не нужные кнопки]]
     * @param {[[object]]} e [[объект события]]
     */
    hideButtons(e) {
        this.isUserReturnCursor = true;
        setTimeout(() => {
            let that = this;
            document.querySelectorAll(this.tableClassName + ' .st-btn').forEach(function (element) {
                if (that.isUserReturnCursor) {
                    element.classList.remove('btn-show');
                }
            })
        }, 500);
    }

    /**
     * [[Функция, которая должна показать кнопку, на которую наведен курсор]]
     * @param {[[object]]} e [[объект события]]
     */
    buttonOver(e) {
        this.isUserReturnCursor = false;
        document.querySelectorAll('.st-btn').forEach(function (elem) {
            if (e !== elem) {
                elem.classList.remove('btn-show');
            }
        });

    }
    /**
     * [[Функция, которая должна скрыть кнопку, на которую не наведен курсор]]
     * @param {[[object]]} e [[объект события]]
     */
    buttonMouseOut(e) {
        this.classList.remove('btn-show');
    }

    /**
     * [[Удаляет строку в таблице]]
     * @param {[[object]]} e [[объект события]]
     */
    deleteRow(e) {
        e.target.classList.remove('btn-show');
        let query = this.tableClassName + ` td[data-row='${this.currentRow}']`;
        document.querySelector(query).parentNode.remove();
        this.RowCount = this.RowCount- 1;
        this.renumarateTd();
    }
    /**
     * [[Удаляет колонку в таблице]]
     * @param {[[object]]} e [[объект события]]
     */
    deleteColumn(e) {
        e.target.classList.remove('btn-show');
        let query = this.tableClassName + ` td[data-column='${this.currentColumn}']`;
        document.querySelectorAll(query).forEach(function (elem) {
            elem.remove()
        });
        this.ColumnCount = this.ColumnCount - 1;
        this.renumarateTd();
    }
    /**
     * [[Добавляет новую строку в таблицу]]
     * @param {[[object]]} e [[объект события]]
     */
    addRow(e) {
        let tr = "<tr>";
        for (let i = 0; i < this.ColumnCount; i++) {
            tr += this.generateTd(i, this.RowCount);
        }
        tr += "</tr>";
        this.RowCount = this.RowCount + 1;
        document.querySelector(this.tableClassName + " table tbody").innerHTML += tr;
    }
    /**
     * [[Добавляет новую колонку в таблицу]]
     * @param {[[object]]} e [[объект события]]
     */
    addColumn(e) {
        let that = this;
        document.querySelectorAll(this.tableClassName + " table tbody tr").forEach(function (item, i) {
            item.innerHTML += that.generateTd(that.ColumnCount, i);
        });
        this.ColumnCount = this.ColumnCount + 1;
    }
    /**
     * [[Проставляет новые номера строк и колонок, после удаления]]
     */
    renumarateTd() {
        let trElements = document.querySelectorAll(this.tableClassName + " table tr");
        let tdElements;
        let tdElement;
        for (let i = 0; i < trElements.length; i++) {
            tdElements = trElements[i].childNodes;
            for (let j = 0; j < tdElements.length; j++) {
                tdElement = tdElements[j];
                tdElement.dataset.row = i;
                tdElement.dataset.column = j;
            }
        }
    }
    /**
     * [[Функция для получения значения размеров таблицы]]
     * @param   {[[string]} param [[параметр который мы получим]]
     * @returns {[[number]]} [[значения параметра]]
     */
    getTableSizeParam(param) {
        return document.querySelector(this.tableClassName + " table").getBoundingClientRect()[param];
    }
}