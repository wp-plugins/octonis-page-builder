<section>
	<div class="supsystic-item supsystic-panel">
		<div id="containerWrapper">
			<ul class="supsystic-bar-controls">
				<li title="<?php _e('Delete selected', OCT_LANG_CODE)?>">
					<button class="button" id="octPagesRemoveGroupBtn" disabled data-toolbar-button>
						<i class="fa fa-fw fa-trash-o"></i>
						<?php _e('Delete selected', OCT_LANG_CODE)?>
					</button>
				</li>
				<li title="<?php _e('Clear All')?>">
					<button class="button" id="octPagesClearBtn" disabled data-toolbar-button>
						<?php _e('Clear', OCT_LANG_CODE)?>
					</button>
				</li>
				<li title="<?php _e('Search', OCT_LANG_CODE)?>">
					<input id="octPagesTblSearchTxt" type="text" name="tbl_search" placeholder="<?php _e('Search', OCT_LANG_CODE)?>">
				</li>
			</ul>
			<div id="octPagesTblNavShell" class="supsystic-tbl-pagination-shell"></div>
			<div style="clear: both;"></div>
			<hr />
			<table id="octPagesTbl"></table>
			<div id="octPagesTblNav"></div>
			<div id="octPagesTblEmptyMsg" style="display: none;">
				<h3><?php _e('You have no Templates for now.', OCT_LANG_CODE)?></h3>
			</div>
		</div>
		<div style="clear: both;"></div>
	</div>
</section>