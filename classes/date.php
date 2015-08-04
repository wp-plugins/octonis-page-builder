<?php
class dateOct {
	static public function _($time = NULL) {
		if(is_null($time)) {
			$time = time();
		}
		return date(OCT_DATE_FORMAT_HIS, $time);
	}
}