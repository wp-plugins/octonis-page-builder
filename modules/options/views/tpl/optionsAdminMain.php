<style type="text/css">
	.octAdminMainLeftSide {
		width: 56%;
		float: left;
	}
	.octAdminMainRightSide {
		width: <?php echo (empty($this->optsDisplayOnMainPage) ? 100 : 40)?>%;
		float: left;
		text-align: center;
	}
	#octMainOccupancy {
		box-shadow: none !important;
	}
</style>
<section>
	<div class="supsystic-item supsystic-panel">
		<div id="containerWrapper">
			<?php _e('Main page Go here!!!!', OCT_LANG_CODE)?>
		</div>
		<div style="clear: both;"></div>
	</div>
</section>