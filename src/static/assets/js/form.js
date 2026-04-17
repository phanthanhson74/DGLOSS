(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".js-form").forEach(function (form) {
            initStepForm(form);
        });
    });

    function initStepForm(form) {
        const prevBtn = form.querySelector(".js-form-prev");
        const nextBtn = form.querySelector(".js-form-next");
        const submitBtn = form.querySelector(".js-form-submit");

        const questions = form.querySelectorAll(".p-front__form-question");
        const stepsWrap = form.closest(".s-entry").querySelector(".p-front__form-steps");

        const steps = stepsWrap.querySelectorAll(".p-front__form-step");
        const stepLines = stepsWrap.querySelectorAll(".p-front__form-step-line");

        if (!form || !prevBtn || !nextBtn || !submitBtn || !questions.length) return;

        let currentStep = 1;
        const totalSteps = questions.length;

        updateView();
        setupErrorClearListeners();

        form.addEventListener("keydown", function (e) {
            if (e.key === "Enter") e.preventDefault();
        });

        prevBtn.addEventListener("click", function () {
            if (currentStep > 1) {
                currentStep--;
                updateView();
            }
        });

        nextBtn.addEventListener("click", function () {
            if (validateCurrentStep() && currentStep < totalSteps) {
                currentStep++;
                updateView();
            }
        });

        submitBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (validateCurrentStep()) {
                submitForm();
            }
        });

        function updateView() {
            // show question
            questions.forEach((q, index) => {
                q.classList.toggle("is-active", index + 1 === currentStep);
            });

            // button state
            prevBtn.disabled = currentStep === 1;

            if (currentStep === totalSteps) {
                nextBtn.style.display = "none";
                submitBtn.style.display = "flex";
            } else {
                nextBtn.style.display = "flex";
                submitBtn.style.display = "none";
            }

            // ✅ update step UI
            steps.forEach((step, index) => {
                step.classList.toggle("is-active", index < currentStep);
            });

            stepLines.forEach((line, index) => {
                line.classList.toggle("is-active", index < currentStep - 1);
            });
        }

        function validateCurrentStep() {
            const currentQuestion = form.querySelector(
                `.p-front__form-question[data-step="${currentStep}"]`
            );

            if (!currentQuestion) return true;

            let isValid = true;
            clearErrors(currentQuestion);

            // RADIO
            const radios = currentQuestion.querySelectorAll(".p-front__form-radio");
            if (radios.length) {
                const checked = currentQuestion.querySelector(".p-front__form-radio:checked");
                if (!checked) {
                    showError(
                        currentQuestion.querySelector(".p-front__form-options"),
                        "選択してください"
                    );
                    isValid = false;
                }
            }

            // INPUT
            const inputs = currentQuestion.querySelectorAll(
                'input[required]:not([type="radio"]):not([type="checkbox"])'
            );

            inputs.forEach((input) => {
                const value = input.value.trim();

                if (!value) {
                    showError(input, "入力してください");
                    isValid = false;
                    return;
                }

                if (input.name === "tel" && !/^[0-9]{10,11}$/.test(value)) {
                    showError(input, "正しい電話番号を入力してください");
                    isValid = false;
                }

                if (
                    input.name === "email" &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {
                    showError(input, "正しいメールアドレスを入力してください");
                    isValid = false;
                }
            });

            // 生年月日
            const year = currentQuestion.querySelector('select[name="birth_year"]');
            const month = currentQuestion.querySelector('select[name="birth_month"]');
            const day = currentQuestion.querySelector('select[name="birth_day"]');

            if (year || month || day) {
                if (!(year.value && month.value && day.value)) {
                    showError(
                        currentQuestion.querySelector(".p-front__form-birthday"),
                        "生年月日を選択してください"
                    );
                    isValid = false;
                }
            }

            // SELECT
            const selects = currentQuestion.querySelectorAll(
                'select[required]:not([name="birth_year"]):not([name="birth_month"]):not([name="birth_day"])'
            );

            selects.forEach((select) => {
                if (!select.value) {
                    showError(select, "選択してください");
                    isValid = false;
                }
            });

            // CHECKBOX
            const checkboxes = currentQuestion.querySelectorAll(
                'input[type="checkbox"][required]'
            );

            checkboxes.forEach((checkbox) => {
                if (!checkbox.checked) {
                    showError(
                        checkbox.closest(".p-front__form-checkbox-group"),
                        "同意が必要です"
                    );
                    isValid = false;
                }
            });

            return isValid;
        }

        function showError(element, message) {
            if (!element) return;

            element.classList.add("is-error");

            const oldError = element.parentNode.querySelector(".p-front__form-error");
            if (oldError) oldError.remove();

            const error = document.createElement("span");
            error.className = "p-front__form-error";
            error.textContent = message;

            element.parentNode.appendChild(error);
        }

        function clearErrors(container) {
            container.querySelectorAll(".is-error").forEach((el) => {
                el.classList.remove("is-error");
            });

            container.querySelectorAll(".p-front__form-error").forEach((el) => {
                el.remove();
            });
        }

        function setupErrorClearListeners() {
            form.addEventListener("input", function (e) {
                const target = e.target;
                target.classList.remove("is-error");

                const error = target.parentNode.querySelector(".p-front__form-error");
                if (error) error.remove();
            });

            form.addEventListener("change", function () {
                clearErrors(
                    form.querySelector(
                        `.p-front__form-question[data-step="${currentStep}"]`
                    )
                );
            });
        }

        function submitForm() {
            submitBtn.disabled = true;
            submitBtn.querySelector(".p-front__form-btn-text").textContent =
                "送信中...";

            form.submit();
        }
    }
})();