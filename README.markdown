<a name="README">[jQuery.channel](https://github.com/martinkr/jQuery.channel)</a>
=======
jQuery.channel is a complete pub/sub implementation build on top of jQuery.Callbacks.

###Features
- preserves the jQuery-chain! $('div').channel('subscribe' ... )
- use regular expressions as wildcards begining on the starting position within the string. - subscribe to multiple channels with just one call: $.channel('subscribe','CHANNEL/SUB*',myFunction)


## Examples

### Subscribe:
<pre>
	jQuery.channel('subscribe','CHANNEL/FOO/BAR', myFunction );
	jQuery.channel('subscribe','CHANNEL/FOO.*', myFunction );
	jQuery.channel('subscribe','CHANNEL/*.FOO/', myFunction );
	jQuery.channel('subscribe','CHANNEL/*.FOO.*/', myFunction );
</pre>

### Unsubscribe
<pre>
	jQuery.channel('unsubscribe','CHANNEL/FOO/BAR', myFunction )
</pre>

### Publish
<pre>
	jQuery.channel('publish','CHANNEL/FOO/BAR')
</pre>

## Advanced
Use Wildcards.
<pre>
	$.channel('subscribe','CHANNEL/SUB*',myFunction)
</pre>


## Requires
 * jQuery JavaScript Library 1.7+ - http://jquery.com/; Copyright 2010, John Resig; Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license

## License
Dual licensed under the MIT and GPL licenses.

* MIT - http://www.opensource.org/licenses/mit-license.php
* GNU - http://www.gnu.org/licenses/gpl-3.0.html

Copyright (c) 2011-2012 Martin Krause (jquery.public.mkrause.info)
