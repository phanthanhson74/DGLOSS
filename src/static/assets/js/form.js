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

    const stepsWrap = form
      .closest(".s-entry")
      .querySelector(".p-front__form-steps");

    const steps = stepsWrap.querySelectorAll(".p-front__form-step");

    if (!form || !prevBtn || !nextBtn || !submitBtn || !questions.length) {
      return;
    }

    let currentStep = 1;
    const totalSteps = questions.length;

    // 初期表示
    updateView();

    // 入力・選択時にエラーをクリア
    setupErrorClearListeners();

    // Enterキーでフォーム送信を防止
    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });

    // 戻るボタン
    prevBtn.addEventListener("click", function () {
      if (currentStep > 1) {
        currentStep--;
        updateView();
      }
    });

    // 次へボタン
    nextBtn.addEventListener("click", function () {
      if (validateCurrentStep() && currentStep < totalSteps) {
        currentStep++;
        updateView();
      }
    });

    // 送信ボタン
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();

      if (validateCurrentStep()) {
        submitForm();
      }
    });

    function updateView() {
      // 質問表示切り替え
      questions.forEach(function (question, index) {
        if (index + 1 === currentStep) {
          question.classList.add("is-active");
        } else {
          question.classList.remove("is-active");
        }
      });

      // ステップ状態切り替え
      steps.forEach(function (step, index) {
        step.classList.remove("is-active", "is-completed");

        if (index + 1 === currentStep) {
          step.classList.add("is-active");
        } else if (index + 1 < currentStep) {
          step.classList.add("is-completed");
        }
      });

      // 戻るボタン
      prevBtn.disabled = currentStep === 1;

      // 次へ / 送信ボタン
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

      // エラー初期化
      clearErrors(currentQuestion);

      // ラジオボタン
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
            showError(optionsContainer, "選択してください");
          }

          isValid = false;
        }
      }

      // 入力フィールド
      const inputs = currentQuestion.querySelectorAll(
        ".js-form-input[required]",
      );

      inputs.forEach(function (input) {
        const value = input.value.trim();
        const name = input.name;

        // 空チェック
        if (!value) {
          if (name === "name") {
            showError(input, "氏名を入力してください");
          } else if (name === "email") {
            showError(input, "メールアドレスを入力してください");
          } else {
            showError(input, "入力してください");
          }

          isValid = false;
          return;
        }

        // 電話番号
        if (name === "tel") {
          // ハイフンあり
          if (value.includes("-")) {
            showError(input, "ハイフンなしで入力してください");
            isValid = false;
            return;
          }

          // 数字以外 or 桁数不正
          if (!/^[0-9]{10,11}$/.test(value)) {
            showError(input, "有効な電話番号を入力してください");
            isValid = false;
            return;
          }
        }
      });

      // メール
      const emailInput = currentQuestion.querySelector(
        '.js-form-input[name="email"]',
      );

      if (emailInput) {
        const emailValue = emailInput.value.trim();

        // 必須
        if (!emailValue) {
          showError(emailInput, "メールアドレスを入力してください");
          isValid = false;
        }
        // 形式不正
        else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)
        ) {
          showError(emailInput, "メールアドレス形式をもう一度ご確認ください");
          isValid = false;
        }
      }

      // 生年月日
      const birthdayContainer =
        currentQuestion.querySelector(".js-form-birthday");

      if (birthdayContainer) {
        const birthdaySelects = birthdayContainer.querySelectorAll(
          ".js-form-select[required]",
        );

        const allFilled = Array.from(birthdaySelects).every(function (select) {
          return select.value;
        });

        if (!allFilled) {
          showError(birthdayContainer, "生年月日を選択してください");
          isValid = false;
        }
      }

      // その他セレクト
      const selects = currentQuestion.querySelectorAll(
        ".js-form-select[required]:not(.p-front__form-select--birthday)",
      );

      selects.forEach(function (select) {
        if (!select.value) {
          showError(select, "選択してください");
          isValid = false;
        }
      });

      // チェックボックス
      const checkboxes = currentQuestion.querySelectorAll(
        ".p-front__form-checkbox[required]",
      );

      checkboxes.forEach(function (checkbox) {
        if (!checkbox.checked) {
          const checkboxGroup = checkbox.closest(
            ".p-front__form-checkbox-group",
          );

          if (checkboxGroup) {
            showError(checkboxGroup, "同意が必要です");
          }

          isValid = false;
        }
      });

      // 最初のエラーへフォーカス
      if (!isValid) {
        const firstError = currentQuestion.querySelector(".is-error");

        if (firstError && typeof firstError.focus === "function") {
          firstError.focus();
        }
      }

      return isValid;
    }

    function showError(element, message) {
      element.classList.add("is-error");

      // 重複防止
      const existingError = element.parentNode.querySelector(
        ".p-front__form-error",
      );

      if (existingError) return;

      const errorMsg = document.createElement("span");

      errorMsg.className = "p-front__form-error";
      errorMsg.textContent = message;

      // ラジオ
      if (element.classList.contains("p-front__form-options")) {
        element.appendChild(errorMsg);
        return;
      }

      // チェックボックス
      if (element.classList.contains("p-front__form-checkbox-group")) {
        element.parentNode.appendChild(errorMsg);
        return;
      }

      // 生年月日
      if (element.classList.contains("js-form-birthday")) {
        element.classList.add("is-error");
        element.parentNode.appendChild(errorMsg);
        return;
      }

      // セレクト
      const selectWrap = element.closest(".p-front__form-select-wrap");

      if (selectWrap) {
        selectWrap.parentNode.appendChild(errorMsg);
        return;
      }

      // 通常input
      element.parentNode.appendChild(errorMsg);
    }

    function clearErrors(container) {
      // error class削除
      const errorElements = container.querySelectorAll(".is-error");

      errorElements.forEach(function (el) {
        el.classList.remove("is-error");
      });

      // error message削除
      const errorMessages = container.querySelectorAll(".p-front__form-error");

      errorMessages.forEach(function (msg) {
        msg.remove();
      });
    }

    function clearElementError(element) {
      element.classList.remove("is-error");

      // 生年月日
      const birthdayGroup = element.closest(".js-form-birthday");

      if (birthdayGroup) {
        birthdayGroup.classList.remove("is-error");

        const errorMsg = birthdayGroup.parentNode.querySelector(
          ".p-front__form-error",
        );

        if (errorMsg) {
          errorMsg.remove();
        }

        return;
      }

      // セレクト
      const selectWrap = element.closest(".p-front__form-select-wrap");

      if (selectWrap) {
        const errorMsg = selectWrap.parentNode.querySelector(
          ".p-front__form-error",
        );

        if (errorMsg) {
          errorMsg.remove();
        }

        return;
      }

      // 通常input
      const parent = element.parentNode;

      const errorMsg = parent.querySelector(".p-front__form-error");

      if (errorMsg) {
        errorMsg.remove();
      }
    }

    function clearContainerError(container, isCheckbox) {
      container.classList.remove("is-error");

      if (isCheckbox) {
        const nextSibling = container.nextElementSibling;

        if (
          nextSibling &&
          nextSibling.classList.contains("p-front__form-error")
        ) {
          nextSibling.remove();
        }
      } else {
        const errorMsg = container.querySelector(".p-front__form-error");

        if (errorMsg) {
          errorMsg.remove();
        }
      }
    }

    function setupErrorClearListeners() {
      // ラジオ
      const radios = form.querySelectorAll(".p-front__form-radio");

      radios.forEach(function (radio) {
        radio.addEventListener("change", function () {
          const optionsContainer = radio.closest(".p-front__form-options");

          if (optionsContainer) {
            clearContainerError(optionsContainer);
          }
        });
      });

      // input
      const inputs = form.querySelectorAll(".js-form-input");

      inputs.forEach(function (input) {
        input.addEventListener("input", function () {
          clearElementError(input);
        });
      });

      // select
      const selects = form.querySelectorAll(".p-front__form-select");

      selects.forEach(function (select) {
        select.addEventListener("change", function () {
          clearElementError(select);
        });
      });

      // checkbox
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
      submitBtn.disabled = true;

      submitBtn.querySelector(".p-front__form-btn-text").textContent =
        "送信中...";

      grecaptcha.ready(function () {
        grecaptcha
          .execute("6LfdaoAsAAAAACdO7rTXoO_JWwnCFrlOxQwzSuoT", {
            action: "submit",
          })
          .then(function (token) {
            const recaptchaInput = form.querySelector(".recaptcha_response");

            if (recaptchaInput) {
              recaptchaInput.value = token;
            }

            form.submit();
          })
          .catch(function (error) {
            console.error(error);

            submitBtn.disabled = false;

            submitBtn.querySelector(".p-front__form-btn-text").textContent =
              "応募する";
          });
      });
    }
  }
})();
