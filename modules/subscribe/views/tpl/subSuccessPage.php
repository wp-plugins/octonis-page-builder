<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<title><?php _e('Subscribe Confirmation', OCT_LANG_CODE)?></title>
	<style type="text/css">
		html, body {
			background-color: #f1f1f1;
			font-family: Lato,​ helvetica, sans-serif;
		}
		a {
			color: #2866ff;
				
		}
		.octConfirmMainShell {
			border: 1px solid #a1a1a1;
			border-radius: 6px;
			width: 540px;
			margin: 0 auto;
			background-color: #fff;
			text-align: center;
		}
		.octErrorMsg {
			color: #db3611;
		}
		.octConfirmContent, .octConfirmTitle {
			padding: 0 20px;
		}
		.octConfirmRedirectShell {
			background-color: #c1e1f7;
			border: 1px solid #7abeef;
			border-right: none;
			border-left: none;
			margin: 20px 0;
			padding: 20px 0;
		}
	</style>
</head>
<body>
	<div class="octConfirmMainShell">
		<?php if($this->res->error()) {
			$errors = $this->res->getErrors();
		?>
		<h1 class="octConfirmTitle"><?php _e('Some errors occured while trying to subscribe', OCT_LANG_CODE)?>:</h1>
		<div class="octConfirmContent">
			<div class="octErrorMsg"><?php echo implode('<br />', $errors)?></div>
		</div>
		<?php
		} else {
			$successMessage = $this->block && isset($this->block['params']['sub_txt_success']['val'])
				? $this->block['params']['sub_txt_success']['val']
				: __('Thank you for subscribe!', OCT_LANG_CODE);
			$redirectUrl = isset($this->block['params']['sub_redirect_url']) && !empty($this->block['params']['sub_redirect_url']['val'])
				? $this->block['params']['sub_redirect_url']['val']
				: get_bloginfo('wpurl');
			$redirectUrl = trim($redirectUrl);
			if(strpos($redirectUrl, 'http') !== 0) {
				$redirectUrl = 'http://'. $redirectUrl;
			}
			$autoRedirectTime = 10;
		?>
		<h1 class="octConfirmTitle"><?php _e('Subscription confirmed', OCT_LANG_CODE)?></h1>
		<div class="octConfirmContent">
			<?php echo $successMessage;?>
		</div>
		<div class="octConfirmRedirectShell">
			<?php printf(__('<a href="%s">Back to site</a> in <i id="octConfirmBackCounter">%d</i> seconds'), $redirectUrl, $autoRedirectTime)?>
		</div>
		<script type="text/javascript">
			var octAutoRedirectTime = <?php echo $autoRedirectTime;?>
			,	octAutoRedirectTimeLeft = octAutoRedirectTime;
			function octAutoRedirectWaitClb() {
				octAutoRedirectTime--;
				if(octAutoRedirectTime > 0) {
					document.getElementById('octConfirmBackCounter').innerHTML = octAutoRedirectTime;
					setTimeout(octAutoRedirectWaitClb, 1000);
				} else {
					window.location.href = '<?php echo $redirectUrl?>';
				}
			}
			setTimeout(octAutoRedirectWaitClb, 1000);
		</script>
		<?php
		}?>
	</div>
</body>
</html>