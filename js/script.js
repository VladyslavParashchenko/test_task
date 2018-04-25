'using strict';

/**
 * 
 * 
 * @param   {string} tableClassName [[Селектор блока, где хранится строка]]
 */
function SmartTable(tableClassName) {
    var row_count = SmartTable.TABLE_DEFAULT_ROW;
    var column_count = SmartTable.TABLE_DEFAULT_COLUMN;
    var that = this;
    var lastHoverColumn = null;
    var lastHoverRow = null;
    this.start = function () {
        setHTML();
        setEventListenter();
    }

    /**
     * [[Вставляет сгенерированную HTML разметку в блок]]
     */
    function setHTML() {
        document.querySelector(tableClassName).innerHTML = getHTML();
    }

    /**
     * [[Добавляет event listeners]]
     */
    function setEventListenter() {
        document.querySelectorAll(tableClassName + ' .inner-container table tr td').forEach(function (item, i, elements) {
            item.addEventListener('mouseover', showButtons);
            item.addEventListener('mouseout', hideButtons);
        });
        document.querySelectorAll(tableClassName + ' .st-btn').forEach(function (item, i, elements) {
            item.addEventListener('mouseover', buttonOver);
            item.addEventListener('click', changeCountRowOrColumn);
            item.addEventListener('mouseout', buttonMouseOut);
        });
    }
    /**
     * [[Сетер для количества строк]]
     * @param {[[number]]} number [[Новое количество строк]]
     */
    this.setRowCount = function (number) {
        row_count = number >= 1 ? number : row_count;
    }
    /**
     * [[Сетер для количества колонок]]
     * @param {[[number]]} number [[Новое количество строк]]
     */
    this.setColumnCount = function (number) {
        column_count = number >= 1 ? number : column_count;
    }
    /**
     * 
     * @returns {[[number]]} [[Возвращает количество строк]]
     */
    this.getRowCount = function () {
        return row_count;
    }
    /**
     * 
     * @returns {[[number]]} [[Возвращает количество столбцов]]
     */
    this.getColumnCount = function () {
        return column_count;
    }

    /**
     * [[Возвращает готовую HTML разметку для таблицы]]
     * @returns {[[string]]} [[html разметка]]
     */
    function getHTML() {
        var html = getHTMLCodeOuterTable();
        html = html.replace('_inner-table', getHTMLCodeInnerTable());
        return html;
    }

    /**
     * [[Возвращает внешнюю html разметку(кнопки+контейнер для таблицы)]]
     * @returns {[[Type]]} [[Description]]
     */
    function getHTMLCodeOuterTable() {
        var isInsertInnerTable = false;
        var html = '<table class="outer-table">';
        for (var i = 0; i < that.getRowCount() + 2; i++) {
            if ((i == 0) || (i == that.getRowCount() + 1)) {
                html += '<tr>';
                for (var j = 0; j < that.getColumnCount() + 2; j++) {
                    if (i == 0) {
                        html += `<td data-column='${j}' data-position=${SmartTable.ROW_NAME} data-is-show='0' data-row='${i}' class="st-btn delete-btn">${SmartTable.TABLE_DELETE_CHAR}</td>`;
                    } else {
                        html += `<td data-column='${j}' data-is-show='0' data-position=${SmartTable.ROW_NAME} data-row='${i}' class="st-btn add-btn">${SmartTable.TABLE_ADD_CHAR}</td>`;
                    }
                }
                html += '</tr>';
            } else {
                if (!isInsertInnerTable) {
                    html += `<tr><td data-row='${i}' data-is-show='0' data-position=${SmartTable.COLUMN_NAME} class="st-btn delete-btn">${SmartTable.TABLE_DELETE_CHAR}</td><td colspan=${that.getColumnCount()} rowspan=${that.getRowCount()} class="inner-container">_inner-table</td><td data-row='${i}' data-position=${SmartTable.COLUMN_NAME} class="st-btn add-btn">${SmartTable.TABLE_ADD_CHAR}</td></tr>`;
                    isInsertInnerTable = !isInsertInnerTable;
                } else {
                    html += `<tr><td data-is-show='0' data-position=${SmartTable.COLUMN_NAME} data-row='${i}' class="st-btn delete-btn">${SmartTable.TABLE_DELETE_CHAR}</td><td data-is-show='0' data-row='${i}' data-position=${SmartTable.COLUMN_NAME} class="st-btn add-btn">${SmartTable.TABLE_ADD_CHAR}</td></tr>`;
                }

            }

        }
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
                html += `<td data-is-show='0' class="inner-table-td" data-column='${j}' data-row='${i}'></td>`;
            }
            html += '</tr>';
        }
        html += '</table>';
        return html;
    }

    /**
     * [[Изменяет прозрачность для кнопок удаления/добавления строк ил колонок]]
     * @param {[[number]]} column  [[Строка на которой нужно показать кнопки]]
     * @param {[[number]]} row     [[Колонка на которой нужно показать кнопки]]
     * @param {[[number]]} opacity [[Значение прозрачности]]
     */
    function changeOpacityButtons(column, row, opacity) {
        /**
         * [[Функция, которая должан изменить прозрачность кнопок строки или колонки]]
         * @param {[[string]]} buttonType  [[Тип кнопки, прозрачность которой нужно изменить]]
         * @param {[[number]]} opacity     [[Прозрачность]]
         * @param {[[number]]} elemNumber  [[Номер строки или колонки]]
         * @param {[[string]]} rowOrColumn [[Отвечает за изменение в колонке или строке]]
         */
        function change(buttonType, opacity, elemNumber, rowOrColumn) {
            var query = tableClassName + ` table tr ${buttonType}[data-${rowOrColumn}='${elemNumber}']`;
            document.querySelectorAll(query).forEach(function (elem) {
                elem.style.opacity = opacity;
                if (elem.dataset.isShow == 0) {
                    elem.dataset.isShow = 1;
                } else {
                    setTimeout(() => {
                        elem.dataset.isShow = 0;
                    }, 500);

                }
            });
        }
        var rowButtonWhatShowSelector = that.getColumnCount() > 1 ? '.st-btn' : '.add-btn';
        var columnButtonWhatShowSelector = that.getRowCount() > 1 ? '.st-btn' : '.add-btn';
        change(rowButtonWhatShowSelector, opacity, row, 'row');
        change(columnButtonWhatShowSelector, opacity, column, 'column');
    }

    /**
     * [[Получить номер строки и колонки, где которые необходимо показать]]
     * @param   {object} target [[Елемент на который навели курсором]]
     * @returns {object} [[Объект с параметрами строки и колонки]]
     */
    function getRowAndColumn(target) {
        var c = target.dataset.column * 1;
        var r = target.dataset.row * 1;
        c++;
        r++;
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
        var obj = getRowAndColumn(this);
        changeOpacityButtons(obj.column, obj.row, 1);
    }
    /**
     * [[Функция, которая должна спрятать не нужные кнопки]]
     * @param {[[object]]} e [[объект события]]
     */
    function hideButtons(e) {
        var obj = getRowAndColumn(this);
        changeOpacityButtons(obj.column, obj.row, 0);
    }

    /**
     * [[Функция, которая должна показать кнопку, на которую наведен курсор]]
     * @param {[[object]]} e [[объект события]]
     */
    function buttonOver(e) {
        if (this.dataset.isShow == 1) {
            this.style.opacity = 1;
        }

    }

    /**
     * [[Функция, которая изменяет размеры таблицы]]
     * @param {[[object]]} e [[объект события]]
     */
    function changeCountRowOrColumn(e) {
        if (this.style.opacity == 1) {
            var deleteOrAdd = this.innerHTML == SmartTable.TABLE_DELETE_CHAR ? -1 : 1;
            if (this.dataset.position == SmartTable.ROW_NAME) {
                that.setRowCount(that.getRowCount() + deleteOrAdd);
            } else {
                that.setColumnCount(that.getColumnCount() + deleteOrAdd);
            }
            that.start();
        }
    }
    /**
     * [[Функция, которая должна скрыть кнопку, на которую не наведен курсор]]
     * @param {[[object]]} e [[объект события]]
     */
    function buttonMouseOut(e) {
        this.dataset.isShow = 0;
        this.style.opacity = 0;
    }
}
SmartTable.ROW_NAME = 1;
SmartTable.COLUMN_NAME = 0;
SmartTable.TABLE_DEFAULT_ROW = 4;
SmartTable.TABLE_DEFAULT_COLUMN = 4;
SmartTable.TABLE_ADD_CHAR = '+';
SmartTable.TABLE_DELETE_CHAR = '-';
