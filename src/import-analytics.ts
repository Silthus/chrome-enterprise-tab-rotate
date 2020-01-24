console.log('import-analytics.js');

const analyticsId = 'UA-156956682-1';

// Standard Google Universal Analytics code

(function(i,s,o,g,r,a,m): void {i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(): void {

// eslint-disable-next-line prefer-rest-params
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date().getTime();a=s.createElement(o),

m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)

})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

ga('create', analyticsId, 'auto');

// eslint-disable-next-line @typescript-eslint/no-empty-function
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200

ga('require', 'displayfeatures');