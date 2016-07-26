(function ()
{
    'use strict';

    const benchmarks = [];
    const rgxTemplate = /\{\{([^}]*)\}\}/g;
    let suites = null;

    const bleacherTemplate = `
        <h1 class="bleacher-header">{{header}}</h1>
        <h2 class="bleacher-useragent">${navigator.userAgent}</h2>
        <h2 class="bleacher-banner"></h2>
        <ol id="bleacher-suites"></ol>
    `;

    const benchTemplate = `
        <li id="bleacher-{{index}}" class="suite">
            <strong onclick="Bleacher.expand({{index}})">
                <span class="name">{{name}}</span>
                <!--<span class="counts">({{tests.length}})</span>-->
            </strong>
            <a href="#{{index}}" onclick="Bleacher.run({{index}})">(Run Suite)</a>
            <span id="bleacher-{{index}}-result" class="result"></span>
            <ol id="bleacher-{{index}}-tests" class="tests">{{testsHtml}}</ol>
        </li>
    `;

    const testTemplate = `
        <li id="bleacher-{{index}}-test-{{testIndex}}" class="nuetral">
            <span>{{name}}:</span>
            <span id="bleacher-{{index}}-test-{{testIndex}}-msg" class="test-message">Not run</span>
            <span id="bleacher-{{index}}-test-{{testIndex}}-result" class="result"></span>
        </li>
    `;

    window.Bleacher = {
        init(id, header)
        {
            const elm = document.getElementById(id || 'bleacher');

            if (!elm) throw new Error('Unable to find bleacher element');

            elm.innerHTML = compile(bleacherTemplate, { header });

            suites = document.getElementById('bleacher-suites');
        },
        add(obj)
        {
            obj.index = benchmarks.length;
            obj.testsHtml = '';

            for (let i = 0; i < obj.tests.length; ++i)
            {
                const test = obj.tests[i];

                test.index = obj.index;
                test.testIndex = i;
                obj.testsHtml += compile(testTemplate, test);
            }

            benchmarks.push(obj);
            suites.innerHTML += compile(benchTemplate, obj);
        },
        expand(index)
        {
            const elm = document.getElementById(`bleacher-${index}-tests`);

            elm.classList.toggle('bleacher-collapsed');
        },
        run(index)
        {
            const bench = benchmarks[index];

            if (!bench)
            {
                console.error('No benchmark found for index %d', index);

                return;
            }

            const suite = new Benchmark.Suite();

            for (let i = 0; i < bench.tests.length; ++i)
            {
                suite.add(bench.tests[i]);
            }

            let testIndex = 0;

            suite
            .on('start', function onStart(event)
            {
                setTestStatus(index, testIndex, 'run');

                for (let i = 1; i < bench.tests.length; ++i)
                {
                    setTestStatus(index, i, 'wait');
                }
            })
            .on('cycle', function onCycle(event)
            {
                event.target._testIndex = testIndex;
                setTestStatus(index, testIndex, 'done', event.target);

                testIndex++;

                setTestStatus(index, testIndex, 'run');
            })
            .on('complete', function onComplete(event)
            {
                event.currentTarget.filter('fastest').forEach((b) =>
                {
                    const elm = document.getElementById(`bleacher-${index}-test-${b._testIndex}`);

                    if (elm)
                    {
                        elm.classList.remove('fast', 'slow', 'neutral');
                        elm.classList.add('fast');
                    }
                });

                event.currentTarget.filter('slowest').forEach((b) =>
                {
                    const elm = document.getElementById(`bleacher-${index}-test-${b._testIndex}`);

                    if (elm)
                    {
                        elm.classList.remove('fast', 'slow', 'neutral');
                        elm.classList.add('slow');
                    }
                });

            })
            .run({ async: true });
        },
    };

    function setTestStatus(index, testIndex, status, bench)
    {
        const li = document.getElementById(`bleacher-${index}-test-${testIndex}`);
        const msg = document.getElementById(`bleacher-${index}-test-${testIndex}-msg`);
        const res = document.getElementById(`bleacher-${index}-test-${testIndex}-result`);

        if (!li || !msg || !res) return;

        li.classList.remove('wait', 'run', 'done');
        li.classList.add(status);

        switch (status)
        {
            case 'wait':
                msg.textContent = 'Waiting...';
                res.textContent = '';
                break;

            case 'run':
                msg.textContent = 'Running...';
                res.textContent = '';
                break;

            case 'done':
                msg.textContent = 'Done.';
                res.textContent = bench.error ? String(bench.error) : String(bench);
                break;
        }
    }

    function compile(template, context)
    {
        return template.replace(rgxTemplate, (match, p1) =>
        {
            const keys = (p1 || '').split('.');

            if (!keys || !keys.length) return '';

            let value = context;

            for (let i = 0; i < keys.length; ++i)
            {
                if (typeof value !== 'object') return '';

                value = value[keys[i]];
            }

            if (typeof value === 'undefined') return '';

            return value;
        });
    }
}());
