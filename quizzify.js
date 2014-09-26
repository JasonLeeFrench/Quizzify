(function($) {
    $.quizzify = function(data, options) {
        var self,
            cover,
            container_elem;
        var quizzify = {
            container: 'quiz_container',
            answers_array: [],
            results_array: [],
            number_of_questions: 0,
            quiz_finished: false,
            init: function(quiz_data, options) {
                self = this;
                if (options) {
                    for (var option in options) {
                        self[option] = options[option];
                    }
                }
                if (typeof(quiz_data) === 'string') {
                    self.tabletop_load(quiz_data);
                } else {
                    //TODO It's a JSON object?
                }
                self.create_cover();
                return self;
            },
            build_answers_array: function(number_of_answers) {
                return Array.apply(null, new Array(number_of_answers)).map(Number.prototype.valueOf, 0);
            },
            do_results: function(answers, results) {
                var results_titles = results[1],
                    results_contents = results[0],
                    results_holder = $('.results'),
                    final_results_array = [];
                var max = answers[0];
                var maxIndex = 0;
                for (var i = 1; i < answers.length; i++) {
                    if (answers[i] > max) {
                        maxIndex = i;
                        max = answers[i];
                    }
                }
                for (var i = 0; i < answers.length; i++){
                    if(answers[i] === max){
                        final_results_array.push(i);    
                    }
                }
                var rand = final_results_array[Math.floor(Math.random() * final_results_array.length)];
                results_holder.removeClass('hidden');
                results_holder.append($('<h2>' + results_titles[rand] + '</h2>'));
                results_holder.append($('<p>' + results_contents[rand] + '</p>'));
            },
            do_answer: function(answer, question) {
                question_id = $('.question_' + question);
                if (question_id.hasClass('answered')) {
                    self.answers_array[parseInt(question_id.find('input:checked').attr('id').split(',')[0])] -= 1;
                }
                self.answers_array[answer] += 1;
                if (self.total_answered(self.answers_array) === self.number_of_questions) {
                    self.do_results(self.answers_array, self.results_array);
                    $('.quiz_container').addClass('complete');
                    $('html,body').animate({
                       scrollTop: $('.results').offset().top
                    },'slow');
                    self.quiz_finished = true;
                }
            },
            create_cover: function() {
                cover = $('#' + self.container);
                container_elem = $('<ul></ul>');
                cover.append(container_elem);
                container_elem.addClass('quiz_container');
                container_elem.css({
                    'width': container_elem.parent().width()
                });
            },
            total_answered: function(arr) {
                var tot = 0;
                for (var i = 0; i < arr.length; i++) {
                    tot += arr[i];
                }
                return tot;
            },
            do_bindings: function(answer) {
                answer.on('click', function(e) {
                    //"PACHOW" - Daisy.
                    var input = $(this).find('input'),
                        ids = input.attr('id').split(','),
                        answer_id = ids[0],
                        question_id = ids[1],
                        question = $(this).parent().parent();
                    if (!self.quiz_finished) {
                        self.do_answer(answer_id, question_id);
                        question.find('input').prop('checked', false);
                        question.children('li').children('div').removeClass('chosen');
                        question.addClass('answered');
                        $(this).addClass('chosen');
                        input.prop("checked", true);
                    }
                    e.preventDefault();
                });
            },
            make_checkbox: function(answer, question_index, answer_index) {
                return $('<p><input id="' + answer_index + ',' + question_index + '" name="' + answer_index + ',' + question_index + '" type="checkbox"><label for="' + answer_index + ',' + question_index + '">' + answer.replace(/\[.*?\]/g, "") + '</label></p>');
            },
            make_image: function(answer, question_index, answer_index) {
                var matches = answer.match(/\[(.*?)\]/);
                if (matches) {
                    var answer_holder = $('<div class="answer_holder ' + answer_index + ',' + question_index + '"></div>'),
                        image_holder = $('<div class="img_holder"></div>');
                    image_holder.append('<img src="' + matches[1] + '"/>');
                    image_holder.append(self.make_checkbox(answer, question_index, answer_index));
                    answer_holder.append(image_holder);
                    self.do_bindings(answer_holder);
                    return answer_holder;
                }
            },
            make_questions: function(row, question_index) {
                var question_container = $('<ol class="question_container question_' + question_index + '"></ol>');
                question_container.append($('<h2>' + row.section + '</h2>'));
                question_container.append(self.make_answers_for_questions(row, question_index));
                container_elem.append(question_container);
                question_container.append('<hr />');
                $('.answers_' + question_index + ' > .answer_holder').shuffle();
            },
            make_answers_for_questions: function(row, question_index) {
                var answer_container = $('<li class="answer_container answers_' + question_index + '"></li>');
                var answer_index = 0;
                for (var answer in row) {
                    if (answer != 'section' && answer != 'rowNumber') {
                        answer_container.append(self.make_image(row[answer], question_index, answer_index));
                        answer_index++;
                    }
                }
                self.answers_array = self.build_answers_array(answer_index);
                return answer_container;
            },
            make_quiz_from_tabletop: function(tabletop) {
                for (var sheetName in tabletop) {
                    var elems = tabletop[sheetName].elements,
                        questions_data = elems.slice(-Math.abs(elems.length),elems.length - 2);
                        results_data_array = tabletop[sheetName].toArray(),
                        column_names = tabletop[sheetName].column_names,
                        results_data = [results_data_array.pop(), results_data_array.pop()];
                    for (var i = 0; i < results_data.length; i++) {
                        results_data[i].shift();
                    }
                    self.results_array = results_data;
                }
                for (var i = 0; i < questions_data.length; i++) {
                    var row = questions_data[i];
                    self.make_questions(row, i);
                }
                container_elem.append($('<div class="results hidden"></div>'));
                self.number_of_questions = questions_data.length;
            },
            tabletop_load: function(spreadsheet_id) {
                Tabletop.init({
                    key: spreadsheet_id,
                    callback: function(data) {
                        var quiz_data = self.make_quiz_from_tabletop(data);
                    }
                });
            }
        };
        return quizzify.init(data, options);
    };
    $.fn.shuffle = function() {
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function() {
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
            });
        this.each(function(i) {
            $(this).replaceWith($(shuffled[i]));
        });
        return $(shuffled);
    };
    $.fn.quizzify = function(data, options) {
        if (!options) {
            options = {};
        }
        options.container = this.attr('id');
        this.quizzify = $.quizzify(data, options);
        return this;
    };
})(jQuery);
