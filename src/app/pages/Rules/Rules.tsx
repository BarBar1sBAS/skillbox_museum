import { useNavigate } from "react-router";
import { Button, Logo, Page, ScenePill, Stack, Text } from "@/uikit/index.ts";
import styles from "./Rules.module.scss";

const STEPS = [
	{
		n: "01",
		title: "Прочитай ситуацию",
		text: "Представь себя на месте героя и подумай, как бы ты поступил.",
	},
	{
		n: "02",
		title: "Выбери один из трех вариантов",
		text: "Нажми на подходящий ответ. До подтверждения выбор можно изменить.",
	},
	{
		n: "03",
		title: "Нажми «Подтвердить выбор»",
		text: "Прочитай объяснение своего решения, затем переходи к следующей ситуации.",
	},
];

const KEY_RULES = [
	"За каждую пройденную ситуацию ты получаешь фрагмент ключа из ее категории.",
	"Пройдешь все ситуации категории — соберешь целый ключ.",
	"Фрагмент ключа дается за правильный ответ и за частично правильный.",
];

export function Rules() {
	const navigate = useNavigate();

	return (
		<Page>
			<header className={styles.header}>
				<Logo />
				<ScenePill label="10 сцен" />
			</header>

			<Stack gap={20}>
				<Text as="h1" variant="h1">
					Правила игры
				</Text>

				<Text variant="bodyMBold" className={styles.dim}>
					Тебя ждут 10 ситуаций из повседневной цифровой жизни. В каждой — 3
					варианта действий.
				</Text>

				<ol className={styles.steps}>
					{STEPS.map((step) => (
						<li key={step.n} className={styles.step}>
							<Text as="span" variant="subtitle" color="accent">
								{step.n}
							</Text>
							<div className={styles.stepBody}>
								<Text as="span" variant="bodyL">
									{step.title}
								</Text>
								<Text variant="bodyM" color="muted">
									{step.text}
								</Text>
							</div>
						</li>
					))}
				</ol>

				<div className={styles.keysCard}>
					<Text variant="bodyMBold">Как получить ключи</Text>
					{KEY_RULES.map((rule) => (
						<Text key={rule} variant="bodyM" color="muted">
							{rule}
						</Text>
					))}
				</div>
			</Stack>

			<div className={styles.cta}>
				<Button arrow onClick={() => navigate("/scene/1")}>
					НАЧАТЬ
				</Button>
			</div>
		</Page>
	);
}
