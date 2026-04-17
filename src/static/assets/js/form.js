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

        // åˆæœŸè¡¨ç¤º
        updateView();

        // å…¥åŠ›ãƒ»é¸æŠžæ™‚ã«ã‚¨ãƒ©ãƒ¼ã‚’ã‚¯ãƒªã‚¢
        setupErrorClearListeners();

        // Enterã‚­ãƒ¼ã§ãƒ•ã‚©ãƒ¼ãƒ é€ä¿¡ã‚’é˜²æ­¢
        form.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });



        function updateView() {
            // è³ªå•ã®è¡¨ç¤ºåˆ‡ã‚Šæ›¿ãˆ
            questions.forEach(function (question, index) {
                if (index + 1 === currentStep) {
                    question.classList.add("is-active");
                } else {
                    question.classList.remove("is-active");
                }
            });

            // ã‚¹ãƒ†ãƒƒãƒ—ã‚¤ãƒ³ã‚¸ã‚±ãƒ¼ã‚¿ãƒ¼ã®æ›´æ–°
            steps.forEach(function (step, index) {
                step.classList.remove("is-active", "is-completed");
                if (index + 1 === currentStep) {
                    step.classList.add("is-active");
                } else if (index + 1 < currentStep) {
                    step.classList.add("is-completed");
                }
            });

            // ãƒœã‚¿ãƒ³ã®è¡¨ç¤ºåˆ‡ã‚Šæ›¿ãˆ
            prevBtn.disabled = currentStep === 1;

            if (currentStep === totalSteps) {
                nextBtn.style.display = "none";
                submitBtn.style.display = "flex";
            } else {
                nextBtn.style.display = "flex";
                submitBtn.style.display = "none";
            }
        }

        function validateCurrentStep() {
            const currentQuestion = form.querySelector(
                '.p-front__form-question[data-step="' + currentStep + '"]',
            );
            if (!currentQuestion) return true;

            let isValid = true;

            // æ—¢å­˜ã®ã‚¨ãƒ©ãƒ¼ã‚’ã‚¯ãƒªã‚¢
            clearErrors(currentQuestion);

            // ãƒ©ã‚¸ã‚ªãƒœã‚¿ãƒ³ã®ãƒãƒªãƒ‡ãƒ¼ã‚·ãƒ§ãƒ³
            const radios = currentQuestion.querySelectorAll(".p-front__form-radio");
            if (radios.length > 0) {
                const checked = currentQuestion.querySelector(
                    ".p-front__form-radio:checked",
                );
                if (!checked) {
                    const optionsContainer = currentQuestion.querySelector(
                        ".p-front__form-options",
                    );
                    if (optionsContainer) {
                        showError(optionsContainer, "é¸æŠžã—ã¦ãã ã•ã„");
                    }
                    isValid = false;
                }
            }

            // å…¥åŠ›ãƒ•ã‚£ãƒ¼ãƒ«ãƒ‰ã®ãƒãƒªãƒ‡ãƒ¼ã‚·ãƒ§ãƒ³
            const inputs = currentQuestion.querySelectorAll(
                ".p-front__form-input[required]",
            );
            inputs.forEach(function (input) {
                const value = input.value.trim();
                const name = input.name;

                // ç©ºãƒã‚§ãƒƒã‚¯
                if (!value) {
                    showError(input, "å…¥åŠ›ã—ã¦ãã ã•ã„");
                    isValid = false;
                    return;
                }

                // é›»è©±ç•ªå·ã®å½¢å¼ãƒã‚§ãƒƒã‚¯
                if (name === "tel") {
                    if (!/^[0-9]{10,11}$/.test(value)) {
                        if (value.includes("-")) {
                            showError(input, "ãƒã‚¤ãƒ•ãƒ³ãªã—ã§å…¥åŠ›ã—ã¦ãã ã•ã„");
                        } else {
                            showError(input, "æ­£ã—ã„é›»è©±ç•ªå·ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„");
                        }
                        isValid = false;
                        return;
                    }
                }

                // ãƒ¡ãƒ¼ãƒ«ã‚¢ãƒ‰ãƒ¬ã‚¹ã®å½¢å¼ãƒã‚§ãƒƒã‚¯
                if (name === "email") {
                    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                        showError(input, "æ­£ã—ã„ãƒ¡ãƒ¼ãƒ«ã‚¢ãƒ‰ãƒ¬ã‚¹ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„");
                        isValid = false;
                        return;
                    }
                }

                // å¹´é½¢ã®å½¢å¼ãƒã‚§ãƒƒã‚¯
                if (name === "age") {
                    if (!/^[0-9]{2}$/.test(value)) {
                        showError(input, "2æ¡ã®æ•°å­—ã§å…¥åŠ›ã—ã¦ãã ã•ã„");
                        isValid = false;
                        return;
                    }
                }
            });

            // ã‚»ãƒ¬ã‚¯ãƒˆãƒœãƒƒã‚¯ã‚¹ã®ãƒãƒªãƒ‡ãƒ¼ã‚·ãƒ§ãƒ³
            const selects = currentQuestion.querySelectorAll(
                ".p-front__form-select[required]",
            );
            selects.forEach(function (select) {
                if (!select.value) {
                    showError(select, "é¸æŠžã—ã¦ãã ã•ã„");
                    isValid = false;
                }
            });

            // ãƒã‚§ãƒƒã‚¯ãƒœãƒƒã‚¯ã‚¹ã®ãƒãƒªãƒ‡ãƒ¼ã‚·ãƒ§ãƒ³
            const checkboxes = currentQuestion.querySelectorAll(
                ".p-front__form-checkbox[required]",
            );
            checkboxes.forEach(function (checkbox) {
                if (!checkbox.checked) {
                    const checkboxGroup = checkbox.closest(
                        ".p-front__form-checkbox-group",
                    );
                    if (checkboxGroup) {
                        showError(checkboxGroup, "åŒæ„ãŒå¿…è¦ã§ã™");
                    }
                    isValid = false;
                }
            });

            // æœ€åˆã®ã‚¨ãƒ©ãƒ¼è¦ç´ ã«ãƒ•ã‚©ãƒ¼ã‚«ã‚¹
            if (!isValid) {
                const firstError = currentQuestion.querySelector(".is-error");
                if (firstError) {
                    firstError.focus();
                }
            }

            return isValid;
        }

        function showError(element, message) {
            element.classList.add("is-error");

            // ã‚¨ãƒ©ãƒ¼ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸è¦ç´ ã‚’ä½œæˆ
            const errorMsg = document.createElement("span");
            errorMsg.className = "p-front__form-error";
            errorMsg.textContent = message;

            // è¦ç´ ã®ç¨®é¡žã«å¿œã˜ã¦æŒ¿å…¥ä½ç½®ã‚’æ±ºå®š
            if (element.classList.contains("p-front__form-options")) {
                element.appendChild(errorMsg);
            } else if (element.classList.contains("p-front__form-checkbox-group")) {
                // ãƒã‚§ãƒƒã‚¯ãƒœãƒƒã‚¯ã‚¹ã‚°ãƒ«ãƒ¼ãƒ—ã®å ´åˆã¯è¦ªè¦ç´ ã«è¿½åŠ 
                element.parentNode.appendChild(errorMsg);
            } else {
                // å¹´é½¢ãƒ•ã‚£ãƒ¼ãƒ«ãƒ‰ã®å ´åˆã¯ p-front__form-age ã®å¾Œã«è¿½åŠ 
                const ageContainer = element.closest(".p-front__form-age");
                if (ageContainer) {
                    ageContainer.parentNode.appendChild(errorMsg);
                    return;
                }

                // ã‚»ãƒ¬ã‚¯ãƒˆãƒœãƒƒã‚¯ã‚¹ã®å ´åˆã¯ p-front__form-select-wrap ã®å¾Œã«è¿½åŠ 
                const selectWrap = element.closest(".p-front__form-select-wrap");
                if (selectWrap) {
                    selectWrap.parentNode.appendChild(errorMsg);
                    return;
                }

                element.parentNode.appendChild(errorMsg);
            }
        }

        function clearErrors(container) {
            // ã‚¨ãƒ©ãƒ¼ã‚¯ãƒ©ã‚¹ã‚’å‰Šé™¤
            const errorElements = container.querySelectorAll(".is-error");
            errorElements.forEach(function (el) {
                el.classList.remove("is-error");
            });

            // ã‚¨ãƒ©ãƒ¼ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’å‰Šé™¤
            const errorMessages = container.querySelectorAll(".p-front__form-error");
            errorMessages.forEach(function (msg) {
                msg.parentNode.removeChild(msg);
            });
        }

        function clearElementError(element) {
            // è¦ç´ è‡ªèº«ã®ã‚¨ãƒ©ãƒ¼ã‚’ã‚¯ãƒªã‚¢
            element.classList.remove("is-error");

            // å¹´é½¢ãƒ•ã‚£ãƒ¼ãƒ«ãƒ‰ã®å ´åˆã¯ p-front__form-input-group ã‹ã‚‰ã‚¨ãƒ©ãƒ¼ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’å‰Šé™¤
            const ageContainer = element.closest(".p-front__form-age");
            if (ageContainer) {
                const inputGroup = ageContainer.parentNode;
                const errorMsg = inputGroup.querySelector(".p-front__form-error");
                if (errorMsg) {
                    inputGroup.removeChild(errorMsg);
                }
                return;
            }

            // ã‚»ãƒ¬ã‚¯ãƒˆãƒœãƒƒã‚¯ã‚¹ã®å ´åˆã¯ p-front__form-input-group ã‹ã‚‰ã‚¨ãƒ©ãƒ¼ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’å‰Šé™¤
            const selectWrap = element.closest(".p-front__form-select-wrap");
            if (selectWrap) {
                const inputGroup = selectWrap.parentNode;
                const errorMsg = inputGroup.querySelector(".p-front__form-error");
                if (errorMsg) {
                    inputGroup.removeChild(errorMsg);
                }
                return;
            }

            // è¦ªè¦ç´ å†…ã®ã‚¨ãƒ©ãƒ¼ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’å‰Šé™¤
            const parent = element.parentNode;
            const errorMsg = parent.querySelector(".p-front__form-error");
            if (errorMsg) {
                parent.removeChild(errorMsg);
            }
        }

        function clearContainerError(container, isCheckbox) {
            container.classList.remove("is-error");

            // ãƒã‚§ãƒƒã‚¯ãƒœãƒƒã‚¯ã‚¹ã®å ´åˆã¯æ¬¡ã®å…„å¼Ÿè¦ç´ ï¼ˆã‚¨ãƒ©ãƒ¼ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ï¼‰ã‚’å‰Šé™¤
            if (isCheckbox) {
                const nextSibling = container.nextElementSibling;
                if (
                    nextSibling &&
                    nextSibling.classList.contains("p-front__form-error")
                ) {
                    nextSibling.parentNode.removeChild(nextSibling);
                }
            } else {
                const errorMsg = container.querySelector(".p-front__form-error");
                if (errorMsg) {
                    container.removeChild(errorMsg);
                }
            }
        }

        function setupErrorClearListeners() {
            // ãƒ©ã‚¸ã‚ªãƒœã‚¿ãƒ³é¸æŠžæ™‚
            const radios = form.querySelectorAll(".p-front__form-radio");
            radios.forEach(function (radio) {
                radio.addEventListener("change", function () {
                    const optionsContainer = radio.closest(".p-front__form-options");
                    if (optionsContainer) {
                        clearContainerError(optionsContainer);
                    }
                });
            });

            // å…¥åŠ›ãƒ•ã‚£ãƒ¼ãƒ«ãƒ‰å…¥åŠ›æ™‚
            const inputs = form.querySelectorAll(".p-front__form-input");
            inputs.forEach(function (input) {
                input.addEventListener("input", function () {
                    clearElementError(input);
                });
            });

            // ã‚»ãƒ¬ã‚¯ãƒˆãƒœãƒƒã‚¯ã‚¹é¸æŠžæ™‚
            const selects = form.querySelectorAll(".p-front__form-select");
            selects.forEach(function (select) {
                select.addEventListener("change", function () {
                    clearElementError(select);
                });
            });

            // ãƒã‚§ãƒƒã‚¯ãƒœãƒƒã‚¯ã‚¹é¸æŠžæ™‚
            const checkboxes = form.querySelectorAll(".p-front__form-checkbox");
            checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener("change", function () {
                    const checkboxGroup = checkbox.closest(
                        ".p-front__form-checkbox-group",
                    );
                    if (checkboxGroup) {
                        clearContainerError(checkboxGroup, true);
                    }
                });
            });
        }

        function submitForm() {
            // é€ä¿¡ä¸­ã®çŠ¶æ…‹ã«ã™ã‚‹
            submitBtn.disabled = true;
            submitBtn.querySelector(".p-front__form-btn-text").textContent =
                "送信中...";

            // reCAPTCHA v3 ãƒˆãƒ¼ã‚¯ãƒ³ã‚’å–å¾—ã—ã¦ã‹ã‚‰ãƒ•ã‚©ãƒ¼ãƒ ã‚’é€ä¿¡
            grecaptcha.ready(function () {
                grecaptcha
                    .execute("6LfdaoAsAAAAACdO7rTXoO_JWwnCFrlOxQwzSuoT", {
                        action: "submit",
                    })
                    .then(function (token) {
                        document.getElementById("recaptcha_response").value = token;
                        form.submit();
                    });
            });
        }
    }
})();