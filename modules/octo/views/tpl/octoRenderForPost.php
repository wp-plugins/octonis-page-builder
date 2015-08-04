<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<title><?php echo $this->post->post_title?></title>
	<?php echo $this->stylesScriptsHtml;?>
</head>
<body>
	<?php if($this->isEditMode) { ?>
		<div id="octMainLoder"></div>
		<div class="octMainBarHandle">
			<i class="octo-icon icon-blus-b"></i>
		</div>
		<div class="octMainTopBar">
			<div class="octMainTopBarLeft">
				<a href="<?php echo $this->allPagesUrl?>" class="octMainTopBarBtn">
					<i class="octo-icon icon-back"></i>
					<?php _e('WP Admin', OCT_LANG_CODE)?>
				</a>
				<span class="octMainTopBarDelimiter">|</span>
				<a href="http://octonis.com/" target="_blank" class="octMainTopBarBtn" style="font-size: 33px;"><?php echo OCT_WP_PLUGIN_NAME;?></a>
			</div>
			<div class="octMainTopBarRight">
				<a href="http://octonis.com/" target="_blank" class="octMainTopBarBtn octMainTopBarDimBtn"><?php _e('About Octonis', OCT_LANG_CODE)?></a>
				<?php /*?><a href="" target="_blank" class="octMainTopBarBtn octMainTopBarDimBtn"><?php _e('More products', OCT_LANG_CODE)?></a><?php */?>
				<a href="<?php echo $this->previewPageUrl?>" target="_blank" class="octMainTopBarBtn"><?php _e('PREVIEW', OCT_LANG_CODE)?></a>
				<button class="button-primary octMainSaveBtn" style="margin-top: 5px; margin-right: 5px;" data-txt="<?php _e('Save Project', OCT_LANG_CODE)?>">
					<div class="octo-icon octo-icon-2x icon-save-progress glyphicon-spin octMainSaveBtnLoader"></div>
					<span class="octMainSaveBtnTxt"><?php _e('Save Project', OCT_LANG_CODE)?></span>
				</button>
			</div>
		</div>
		<?php foreach($this->originalBlocksByCategories as $cat) { ?>
		<div class="navmenu navmenu-default navmenu-fixed-left offcanvas in canvas-slid octBlocksBar" data-cid="<?php echo $cat['id']?>">
			<ul class="nav navmenu-nav octBlocksList">
				<?php foreach($cat['blocks'] as $block) { ?>
					<li class="octBlockElement" data-id="<?php echo $block['id']?>">
						<img src="<?php echo $block['img_url']?>" class="octBlockElementImg" />
					</li>
				<?php }?>
			</ul>
		</div>
		<?php }?>
		<div class="navmenu navmenu-default navmenu-fixed-left offcanvas in canvas-slid octMainBar">
			<i class="octo-icon icon-genie octo-icon-5x octMainIcon"></i>
			<ul class="nav navmenu-nav">
				<?php foreach($this->originalBlocksByCategories as $cat) { ?>
					<li class="octCatElement" data-id="<?php echo $cat['id']?>">
						<a href="#">
							<?php /*?><div class="octCatElementIcon" style="background-image: url(<?php echo $cat['icon_url']?>)"></div><?php */?>
							<?php echo $cat['label']?>
						</a>
					</li>
				<?php }?>
			</ul>
		</div>
		<script type="text/javascript">
			var g_octBlocksById = {};
			<?php foreach($this->originalBlocksByCategories as $cat) { ?>
				<?php foreach($cat['blocks'] as $block) { ?>
					g_octBlocksById[ <?php echo $block['id']?> ] = <?php echo utilsOct::jsonEncode($block)?>;
				<?php }?>
			<?php }?>
		</script>
	<?php }?>
	<div id="octCanvas">
		<?php if(!empty($this->octo['blocks'])) {?>
			<?php foreach($this->octo['blocks'] as $block) { ?>
				<?php echo $block['rendered_html']?>
			<?php }?>
		<?php }?>
	</div>
	<?php echo $this->commonFooter;?>
	<?php if($this->isEditMode) {
		echo $this->editorFooter;
	} else {
		echo $this->footer;
	}?>
</body>
</html>