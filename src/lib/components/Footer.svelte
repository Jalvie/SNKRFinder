<footer class="footer">
	<div class="footer-content">
		<div class="container portfolio-container">
			<h3>Portfolio</h3>
			<a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer" class="portfolio-link">
				View My Portfolio
			</a>
		</div>
		
		<div class="container legal-container">
			<h3>Legal</h3>
			<div class="legal-links">
				<a href="/privacy-policy" class="legal-link">Privacy Policy</a>
				<a href="/cookie-policy" class="legal-link">Cookie Policy</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: #1a1a1a;
		color: white;
		padding: 2rem 0 1rem 0;
		margin-top: auto;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
	}

	.container {
		flex: 1;
	}

	.container h3 {
		color: #ff0000;
		margin-bottom: 1rem;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.portfolio-link {
		color: white;
		text-decoration: none;
		padding: 0.5rem 1rem;
		background-color: #ff0000;
		border-radius: 6px;
		transition: background-color 0.3s ease;
		display: inline-block;
	}

	.portfolio-link:hover {
		background-color: #cc0000;
	}

	.legal-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.legal-link {
		color: #cccccc;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.legal-link:hover {
		color: white;
	}

	@media (max-width: 400px) {
		.footer-content {
			flex-direction: column;
			text-align: center;
			gap: 1.5rem;
			align-items: center;
		}

		.container {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
		}

		.legal-links {
			align-items: center;
		}
	}
</style> 