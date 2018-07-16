# numValidator

Purpose: To validate user Input
	Works only with unique selectors or just picking up the first one.
	Allowed keys [0-9.,], backspace, arrow keys, delete, tab
	example of usage:
		$NumValidator({      // global name
			maxLen: 8,       // optional default 8
			decMaxLen: 2,    // optional default 2
			DEBUG: false,    // optional default false
			selector: '#txt' // required, query Selector
		})
		.activeOn('keydown') // required
		.disableOn(['paste','drop']) // optional
    @author b.kodua
    @version 1.0 26/06/18