Quizzify
========

Make Buzzfeed-type personality quizzes from Google Spreadsheets: no fuss, no code (well, maybe a tiny bit).

Requires Tabletop.js and jQuery.

Usage
========

1. Write your quiz (<a href="https://docs.google.com/spreadsheets/d/1v8HD8KrmIIyt_qgPCxBG6N0XNnmwJbDrUQEfVE7aPK8/pubhtml" target="_blank">example</a>)
2. Include Tabletop.js and jQuery (and maybe quizzify.min.css, though you can come up with your own)
3. Paste in this, subbing YOUR_SPREADSHEET_ADDRESS for, uh, your spreadsheet address

```
<div id="quiz-holder"></div>

<script>
    jQuery(function($) {
        $('#quiz-holder').quizzify(YOUR_SPREADSHEET_ADDRESS);
    });
</script>
```

And you're done!

To Dos 
========

* Responsivate
* Prettify
* Imageless answers
* Options to change colo(u)rs?
* Use web storage to remember where user is in the quiz
* Read JSON instead of Google Spreadsheet URL
